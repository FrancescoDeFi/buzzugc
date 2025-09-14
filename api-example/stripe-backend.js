// Example Node.js/Express backend for Stripe integration
// This is a reference implementation - you'll need to adapt it to your backend framework

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Price configurations (should match frontend)
// Note: Replace the price IDs with your actual Price IDs from Stripe Dashboard
const PRICE_CONFIGS = {
  starter: {
    productId: 'prod_T3MDxu75j4N3Wx', // Your actual Stripe Product ID for Startup plan
    priceId: 'price_1S7FVWCyEFxXrv4D5I2muWZ4', // Your actual Price ID for Startup plan
    features: {
      creationsLimit: 5,
      hdQuality: true,
      premiumAvatars: false,
    }
  },
  professional: {
    productId: 'prod_T3MFZuYnkHPND9', // Your actual Stripe Product ID for Growth plan
    priceId: 'price_1S7FX0CyEFxXrv4DtPmuax2n', // Your actual Price ID for Growth plan
    features: {
      creationsLimit: 10,
      hdQuality: true,
      premiumAvatars: true,
    }
  }
};

// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId, userEmail, successUrl, cancelUrl } = req.body;

    const priceConfig = PRICE_CONFIGS[planId];
    if (!priceConfig) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        planId: planId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe Webhook Handler
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;
    
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
    
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionCancellation(deletedSubscription);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Handle successful payment
async function handleSuccessfulPayment(session) {
  const { userId, planId } = session.metadata;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  try {
    // Get plan configuration
    const priceConfig = PRICE_CONFIGS[planId];
    
    // Update user in Supabase
    const { error } = await supabase
      .from('users')
      .update({
        plan: planId,
        subscription_status: 'active',
        subscription_id: subscriptionId,
        customer_id: customerId,
        creations_limit: priceConfig.features.creationsLimit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user:', error);
    } else {
      console.log(`Successfully activated ${planId} plan for user ${userId}`);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Handle subscription updates
async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  
  try {
    // Find user by customer ID
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('customer_id', customerId)
      .single();

    if (findError || !users) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Update subscription status
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', users.id);

    if (error) {
      console.error('Error updating subscription:', error);
    } else {
      console.log(`Updated subscription status to ${subscription.status} for user ${users.id}`);
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancellation(subscription) {
  const customerId = subscription.customer;
  
  try {
    // Find user by customer ID
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('customer_id', customerId)
      .single();

    if (findError || !users) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Update user to free plan
    const { error } = await supabase
      .from('users')
      .update({
        plan: null,
        subscription_status: 'canceled',
        subscription_id: null,
        creations_limit: 0, // or whatever your free limit is
        updated_at: new Date().toISOString(),
      })
      .eq('id', users.id);

    if (error) {
      console.error('Error canceling subscription:', error);
    } else {
      console.log(`Canceled subscription for user ${users.id}`);
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

// Verify payment session (called from frontend after redirect)
app.get('/api/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      res.json({ 
        success: true, 
        planId: session.metadata.planId,
        subscriptionId: session.subscription 
      });
    } else {
      res.json({ success: false, error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ success: false, error: 'Session verification failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
