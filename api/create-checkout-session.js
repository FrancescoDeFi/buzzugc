import Stripe from 'stripe';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set in environment variables');
    return res.status(500).json({
      error: 'Stripe is not configured',
      details: 'Missing STRIPE_SECRET_KEY environment variable'
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { priceId, planId } = req.body;

  // Validate input
  if (!priceId) {
    return res.status(400).json({
      error: 'Missing required parameter: priceId'
    });
  }

  console.log('Creating checkout session:', { priceId, planId });

  try {
    // Get the origin from request headers or use default
    const origin = req.headers.origin || req.headers.referer || 'https://buzzugc.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${origin}/`,
      metadata: {
        planId: planId || '',
      },
    });

    console.log('Checkout session created:', session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message
    });
  }
}