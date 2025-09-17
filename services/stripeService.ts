import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe (client-only)
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key is not configured');
      return Promise.resolve(null);
    }
    if (!publishableKey.startsWith('pk_')) {
      console.error('Invalid Stripe publishable key format. Expected key to start with "pk_" but got:', publishableKey.substring(0, 12) + '...');
      if (import.meta.env.DEV) {
        alert('Invalid Stripe publishable key. Please set VITE_STRIPE_PUBLISHABLE_KEY to your actual pk_test_ or pk_live_ key.');
      }
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
    productId: 'prod_T4ZX4YhZmHIeXs', // Stripe product ID for Basic plan
    priceId: 'price_1S8QOcCyEFxXrv4DmwLQiRSJ', // Price ID for Basic plan
    planId: 'basic',
    name: 'Basic',
    amount: 900, // $9.00
    currency: 'usd',
    interval: 'month',
    features: [
      '10 video creations per month',
      'Access to core AI creators',
      'Standard processing speed',
      'Email support'
    ]
  },
  {
    productId: 'prod_T3MDxu75j4N3Wx', // Stripe product ID for Startup plan
    priceId: 'price_1S7FVWCyEFxXrv4D5I2muWZ4', // Price ID for Startup plan
    planId: 'starter',
    name: 'Starter',
    amount: 4900, // $49.00
    currency: 'usd',
    interval: 'month',
    features: [
      '30 video creations per month',
      '50+ realistic AI creators',
      'Most realistic results',
      'Processed in 2 minutes',
      'Custom AI hooks'
    ]
  },
  {
    productId: 'prod_T3MFZuYnkHPND9', // Stripe product ID for Growth plan
    priceId: 'price_1S7FX0CyEFxXrv4DtPmuax2n', // Price ID for Growth plan
    planId: 'professional',
    name: 'Growth',
    amount: 6900, // $69.00
    currency: 'usd',
    interval: 'month',
    features: [
      '50 video creations per month',
      '50+ realistic AI creators',
      'Most realistic results',
      'Processed in 2 minutes',
      'Custom AI hooks',
      'Create content in bulk'
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

// Client-only redirect to Stripe Checkout using price ID
export const checkoutWithPrice = async (
  planId: string,
  opts?: { successUrl?: string; cancelUrl?: string; customerEmail?: string }
): Promise<{ error?: any }> => {
  const stripe = await getStripe();
  if (!stripe) {
    return { error: new Error('Stripe not initialized. Missing publishable key?') };
  }

  const price = STRIPE_PRICES.find(p => p.planId === planId);
  if (!price) {
    return { error: new Error(`Unknown planId: ${planId}`) };
  }

  const successUrl = opts?.successUrl ?? `${window.location.origin}?success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = opts?.cancelUrl ?? `${window.location.origin}?canceled=true&plan=${planId}`;

  const result = await stripe.redirectToCheckout({
    lineItems: [
      {
        price: price.priceId,
        quantity: 1,
      },
    ],
    mode: price.interval ? 'subscription' : 'payment',
    successUrl,
    cancelUrl,
    customerEmail: opts?.customerEmail,
  });

  if (result.error) {
    console.error('Stripe checkout error:', result.error);
    return { error: result.error };
  }
  return {};
};

// Handle successful payment (typically called from a success page)
export const handleSuccessfulPayment = async (sessionId: string) => {
  try {
    // Client-only: we cannot verify on the client.
    // This is a no-op placeholder to keep the UI flow consistent.
    console.log('Payment successful (client-only). session:', sessionId);
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
