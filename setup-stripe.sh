#!/bin/bash

# Stripe Setup Script for BuzzUGC
echo "🎬 Setting up Stripe for BuzzUGC..."

# Create .env file with your live Stripe key
cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration (LIVE KEY - Ready for Production!)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S7FPmCyEFxXrv4DIiJuJkAGnZN9w4mMwRU030qzsKzBbnrDNjAS1433z67Ave1bU8YOyoyJqgnNCDqxnVoM8qXQ00HBl9C9rV

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# FAL AI Configuration
VITE_FAL_API_KEY=your_fal_api_key_here
EOF

echo "✅ Created .env file with your live Stripe publishable key"
echo ""
echo "⚠️  IMPORTANT: This is a LIVE key - real payments will be processed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your Supabase, Gemini, and FAL API keys in .env"
echo "2. Set up your backend with live secret key"
echo "3. Configure Stripe webhooks"
echo ""
echo "✅ Your Price IDs are already configured:"
echo "   • Startup: price_1S7FVWCyEFxXrv4D5I2muWZ4"
echo "   • Growth: price_1S7FX0CyEFxXrv4DtPmuax2n"
echo ""
echo "🚀 Ready to accept real payments!"
