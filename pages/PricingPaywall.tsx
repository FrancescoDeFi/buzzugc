import React, { useState } from 'react';
import { createCheckoutSession, redirectToCheckout, getPriceByPlanId } from '../services/stripeService';

interface PricingPaywallProps {
  onSelectPlan: (planId: string) => void;
  onSkip?: () => void;
}

const PricingPaywall: React.FC<PricingPaywallProps> = ({ onSelectPlan, onSkip }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      creations: 5,
      features: [
        '5 AI video creations per month',
        'HD quality videos',
        'Basic AI avatars',
        'Standard voice options',
        'Email support',
        'Basic analytics'
      ],
      popular: false,
      buttonText: 'Start Creating'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      creations: 10,
      features: [
        '10 AI video creations per month',
        'HD & 4K quality videos',
        'Premium AI avatars',
        'Advanced voice cloning',
        'Priority support',
        'Advanced analytics',
        'Custom backgrounds',
        'Bulk creation tools'
      ],
      popular: true,
      buttonText: 'Go Professional'
    },
    {
      id: 'custom',
      name: 'Enterprise',
      price: null,
      creations: 'Unlimited',
      features: [
        'Unlimited AI video creations',
        'Custom AI avatar training',
        'White-label solution',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees',
        'Advanced security'
      ],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      // Handle Enterprise/Custom plan
      if (planId === 'custom') {
        // For custom/enterprise plans, redirect to contact sales or handle differently
        window.open('mailto:sales@buzzugc.com?subject=Enterprise Plan Inquiry', '_blank');
        setIsProcessing(false);
        return;
      }

      // Get Stripe price information
      const priceInfo = getPriceByPlanId(planId);
      if (!priceInfo) {
        console.error('Price information not found for plan:', planId);
        setIsProcessing(false);
        return;
      }

      // Create checkout session
      const sessionData = {
        planId: planId,
        priceId: priceInfo.priceId,
        successUrl: `${window.location.origin}?success=true&plan=${planId}`,
        cancelUrl: `${window.location.origin}?canceled=true`,
      };

      const session = await createCheckoutSession(sessionData);
      
      if (!session) {
        console.error('Failed to create checkout session');
        setIsProcessing(false);
        return;
      }

      // Redirect to Stripe Checkout
      const { error } = await redirectToCheckout(session.sessionId);
      
      if (error) {
        console.error('Stripe checkout error:', error);
        setIsProcessing(false);
        return;
      }

      // If we reach here, the redirect should have happened
      // If not, something went wrong
      setIsProcessing(false);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      setIsProcessing(false);
      
      // For now, fallback to the original behavior for testing
      // Remove this in production once Stripe backend is set up
      console.log('Falling back to original flow for testing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSelectPlan(planId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">buzzUGC</span>
          </div>
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start creating professional AI videos today. Pick the plan that fits your needs and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-black shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {plan.price ? (
                      <div className="flex items-center justify-center">
                        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">Custom</div>
                    )}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold">{plan.creations}</span> video creations
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing && selectedPlan === plan.id}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50 ${
                    plan.popular
                      ? 'bg-black text-white hover:bg-gray-800 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Features */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">All plans include:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Commercial usage rights
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              24/7 support
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              7-day free trial
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h3>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan later?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">What happens if I exceed my monthly limit?</h4>
              <p className="text-gray-600">You can purchase additional credits or upgrade to a higher plan. We'll notify you when you're approaching your limit.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPaywall;