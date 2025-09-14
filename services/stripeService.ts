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
export const STRIPE_PRICES: StripePrice[] = [
  {
    productId: 'prod_T3MDxu75j4N3Wx', // Stripe product ID for Startup plan
    priceId: 'price_1S7FVWCyEFxXrv4D5I2muWZ4', // Price ID for Startup plan
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
    productId: 'prod_T3MFZuYnkHPND9', // Stripe product ID for Growth plan
    priceId: 'price_1S7FX0CyEFxXrv4DtPmuax2n', // Price ID for Growth plan
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

// Create a checkout session
export const createCheckoutSession = async (data: CheckoutSessionData): Promise<{ sessionId: string } | null> => {
  try {
    console.log('Creating checkout session with data:', data);

    // Call the backend API to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('API error response:', responseData);
      throw new Error(responseData.details || responseData.error || `HTTP error! status: ${response.status}`);
    }

    console.log('Checkout session created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    // Show more details in development
    if (import.meta.env.DEV) {
      alert(`Checkout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
