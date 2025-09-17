-- User Subscriptions Table Setup
-- Run this SQL in your Supabase SQL Editor

-- Create user_subscriptions table to manage plan memberships
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL, -- 'basic', 'starter', 'professional', 'enterprise'
    plan_name TEXT NOT NULL, -- 'Basic', 'Starter', 'Growth', 'Enterprise'
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'canceled', 'past_due', 'unpaid'
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);

-- Grant Growth plan to patrick.hilpold.hp@gmail.com
INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    plan_name,
    status,
    current_period_start,
    current_period_end
) VALUES (
    '982f2b92-0e41-443e-9822-e10b80c1cc1a', -- patrick.hilpold.hp@gmail.com user ID
    'professional', -- Growth plan ID (internal name is 'professional')
    'Growth',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year' -- Give 1 year access
) ON CONFLICT (user_id) DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    plan_name = EXCLUDED.plan_name,
    status = EXCLUDED.status,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW();

-- Add unique constraint to prevent multiple active subscriptions per user
ALTER TABLE public.user_subscriptions ADD CONSTRAINT unique_active_user_subscription 
    UNIQUE (user_id) WHERE status = 'active';
