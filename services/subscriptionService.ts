import { supabase } from './supabaseClient';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

// Temporary hardcoded Growth plan users (until database table is set up)
const GROWTH_PLAN_USERS = [
  'patrick.hilpold.hp@gmail.com',
  '982f2b92-0e41-443e-9822-e10b80c1cc1a' // User ID for patrick.hilpold.hp@gmail.com
];

/**
 * Check if current user is a super admin
 */
export const isSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check user metadata for super admin flag
    const isAdmin = user.user_metadata?.is_super_admin === true || 
                   user.raw_user_meta_data?.is_super_admin === true;
    
    console.log('Super admin check:', { 
      email: user.email, 
      isAdmin,
      metadata: user.user_metadata,
      rawMetadata: user.raw_user_meta_data 
    });
    
    return isAdmin;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

/**
 * Get user's current subscription plan
 */
export const getUserSubscription = async (userId?: string): Promise<UserSubscription | null> => {
  if (!userId) {
    const { data: userData } = await supabase.auth.getUser();
    userId = userData.user?.id;
  }
  
  if (!userId) return null;

  try {
    // Check if user is super admin first - they get enterprise access
    if (await isSuperAdmin()) {
      return {
        id: `super-admin-${userId}`,
        user_id: userId,
        plan_id: 'enterprise',
        plan_name: 'Enterprise (Super Admin)',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 years
      };
    }

    // First try to get from database table
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!error && data) {
      return data as UserSubscription;
    }

    // Fallback: Check hardcoded Growth plan users
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData.user?.email;
    
    if (GROWTH_PLAN_USERS.includes(userId) || (userEmail && GROWTH_PLAN_USERS.includes(userEmail))) {
      return {
        id: `temp-${userId}`,
        user_id: userId,
        plan_id: 'professional',
        plan_name: 'Growth',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

/**
 * Check if user has access to a specific plan or feature
 */
export const hasAccess = async (requiredPlan: 'basic' | 'starter' | 'professional' | 'enterprise'): Promise<boolean> => {
  const subscription = await getUserSubscription();
  if (!subscription || subscription.status !== 'active') return false;

  const planHierarchy = {
    basic: 1,
    starter: 2,
    professional: 3,
    enterprise: 4
  };

  const userPlanLevel = planHierarchy[subscription.plan_id as keyof typeof planHierarchy] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan];

  return userPlanLevel >= requiredPlanLevel;
};

/**
 * Get user's plan limits and features
 */
export const getUserPlanLimits = async () => {
  const subscription = await getUserSubscription();
  
  if (!subscription || subscription.status !== 'active') {
    return {
      plan: 'free',
      monthlyCreations: 0,
      hasHDQuality: false,
      hasPremiumAvatars: false,
      hasAdvancedVoices: false,
      hasPrioritySupport: false,
      hasAnalytics: false,
      hasCustomBackgrounds: false,
      hasBulkTools: false
    };
  }

  switch (subscription.plan_id) {
    case 'basic':
      return {
        plan: 'basic',
        monthlyCreations: 10,
        hasHDQuality: true,
        hasPremiumAvatars: false,
        hasAdvancedVoices: false,
        hasPrioritySupport: false,
        hasAnalytics: false,
        hasCustomBackgrounds: false,
        hasBulkTools: false
      };
    
    case 'starter':
      return {
        plan: 'starter',
        monthlyCreations: 30, // Updated from 5 to 30
        hasHDQuality: true,
        hasPremiumAvatars: false,
        hasAdvancedVoices: false,
        hasPrioritySupport: false,
        hasAnalytics: true,
        hasCustomBackgrounds: false,
        hasBulkTools: false
      };
    
    case 'professional':
      return {
        plan: 'growth',
        monthlyCreations: 50, // Updated from 10 to 50
        hasHDQuality: true,
        hasPremiumAvatars: true,
        hasAdvancedVoices: true,
        hasPrioritySupport: true,
        hasAnalytics: true,
        hasCustomBackgrounds: true,
        hasBulkTools: true
      };
    
    case 'enterprise':
      return {
        plan: 'enterprise',
        monthlyCreations: -1, // Unlimited
        hasHDQuality: true,
        hasPremiumAvatars: true,
        hasAdvancedVoices: true,
        hasPrioritySupport: true,
        hasAnalytics: true,
        hasCustomBackgrounds: true,
        hasBulkTools: true
      };
    
    default:
      return {
        plan: 'free',
        monthlyCreations: 0,
        hasHDQuality: false,
        hasPremiumAvatars: false,
        hasAdvancedVoices: false,
        hasPrioritySupport: false,
        hasAnalytics: false,
        hasCustomBackgrounds: false,
        hasBulkTools: false
      };
  }
};

/**
 * Get user's current monthly video generation count
 */
export const getMonthlyUsage = async (userId?: string): Promise<number> => {
  if (!userId) {
    const { data: userData } = await supabase.auth.getUser();
    userId = userData.user?.id;
  }
  
  if (!userId) return 0;

  try {
    // Get current month's video count
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('creations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    if (error) {
      console.error('Error getting monthly usage:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error calculating monthly usage:', error);
    return 0;
  }
};

/**
 * Check if user can generate another video (quota check)
 */
export const canGenerateVideo = async (): Promise<{ canGenerate: boolean; usage: number; limit: number; message?: string }> => {
  try {
    // Super admins have unlimited access
    if (await isSuperAdmin()) {
      return {
        canGenerate: true,
        usage: 0,
        limit: -1, // Unlimited
        message: 'Super Admin - Unlimited Access'
      };
    }

    const [planLimits, currentUsage] = await Promise.all([
      getUserPlanLimits(),
      getMonthlyUsage()
    ]);

    const limit = planLimits.monthlyCreations;
    
    // Enterprise has unlimited
    if (limit === -1) {
      return {
        canGenerate: true,
        usage: currentUsage,
        limit: -1,
        message: 'Enterprise - Unlimited Access'
      };
    }

    // Check if under limit
    const canGenerate = currentUsage < limit;
    const remaining = limit - currentUsage;

    return {
      canGenerate,
      usage: currentUsage,
      limit,
      message: canGenerate 
        ? `${remaining} video${remaining === 1 ? '' : 's'} remaining this month`
        : `Monthly limit reached (${currentUsage}/${limit}). Upgrade your plan to generate more videos.`
    };
  } catch (error) {
    console.error('Error checking video generation quota:', error);
    return {
      canGenerate: false,
      usage: 0,
      limit: 0,
      message: 'Error checking quota. Please try again.'
    };
  }
};

/**
 * Create or update user subscription (for admin use)
 */
export const createUserSubscription = async (
  userId: string,
  planId: string,
  planName: string,
  durationMonths: number = 1
): Promise<boolean> => {
  try {
    const subscriptionData = {
      user_id: userId,
      plan_id: planId,
      plan_name: planName,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { error } = await supabase
      .from('user_subscriptions')
      .upsert(subscriptionData, { onConflict: 'user_id' });

    if (error) {
      console.error('Error creating subscription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error creating user subscription:', error);
    return false;
  }
};
