import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key is not configured');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface StripePrice {
  productId: string; // Stripe Product ID
  priceId: string;   // Stripe Price ID (needed for checkout)
  planId: string;
  name: string;
  amount: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

// Stripe price configurations with your actual product IDs
// Note: You'll need to add the Price IDs from your Stripe dashboard
export const STRIPE_PRICES: StripePrice[] = [
  {
    productId: 'prod_T3MDxu75j4N3Wx', // Your actual Stripe product ID for Startup plan
    priceId: 'price_1S7FVWCyEFxXrv4D5I2muWZ4', // Your actual Price ID for Startup plan
    planId: 'starter',
    name: 'Starter',
    amount: 4900, // $49.00
    currency: 'usd',
    interval: 'month',
    features: [
      '5 AI video creations per month',
      'HD quality videos',
      'Basic AI avatars',
      'Standard voice options',
      'Email support',
      'Basic analytics'
    ]
  },
  {
    productId: 'prod_T3MFZuYnkHPND9', // Your actual Stripe product ID for Growth plan
    priceId: 'price_1S7FX0CyEFxXrv4DtPmuax2n', // Your actual Price ID for Growth plan
    planId: 'professional',
    name: 'Professional',
    amount: 7900, // $79.00
    currency: 'usd',
    interval: 'month',
    features: [
      '10 AI video creations per month',
      'HD & 4K quality videos',
      'Premium AI avatars',
      'Advanced voice cloning',
      'Priority support',
      'Advanced analytics',
      'Custom backgrounds',
      'Bulk creation tools'
    ]
  }
];

export interface CheckoutSessionData {
  planId: string;
  priceId: string;
  userId?: string;
  userEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

// Create a checkout session (this would typically be done on your backend)
export const createCheckoutSession = async (data: CheckoutSessionData): Promise<{ sessionId: string } | null> => {
  try {
    // In a real application, this would be an API call to your backend
    // For now, we'll simulate the creation of a checkout session
    
    // This is where you would make a POST request to your backend endpoint
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    
    // For demonstration purposes, we'll return a mock session ID
    // In production, replace this with actual backend integration
    console.warn('Stripe checkout session creation needs backend integration');
    
    // Simulate API response
    return {
      sessionId: 'cs_test_mock_session_id_' + Date.now()
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string): Promise<{ error?: any }> => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const result = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (result.error) {
      console.error('Stripe checkout error:', result.error);
      return { error: result.error };
    }

    return {};
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    return { error };
  }
};

// Handle successful payment (typically called from a success page)
export const handleSuccessfulPayment = async (sessionId: string) => {
  try {
    // In a real application, you would verify the session on your backend
    // and update the user's subscription status in your database
    console.log('Payment successful for session:', sessionId);
    
    // This is where you would:
    // 1. Verify the session with Stripe
    // 2. Update user's subscription in your database
    // 3. Grant access to paid features
    
    return { success: true };
  } catch (error) {
    console.error('Error handling successful payment:', error);
    return { success: false, error };
  }
};

// Get price information by plan ID
export const getPriceByPlanId = (planId: string): StripePrice | undefined => {
  return STRIPE_PRICES.find(price => price.planId === planId);
};

export default getStripe;
