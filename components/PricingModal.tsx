import React, { useState } from 'react';
import { checkoutWithPrice } from '../services/stripeService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: string) => {
    try {
      setSelectedPlan(planId);
      setIsProcessing(true);

      const { error } = await checkoutWithPrice(planId, {
        successUrl: `${window.location.origin}?success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}?canceled=true&plan=${planId}`,
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        alert(`Payment failed: ${error.message || 'Unknown error'}`);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      creations: 30,
      features: [
        '30 video creations per month',
        '50+ realistic AI creators',
        'Most realistic results',
        'Processed in 2 minutes',
        'Custom AI hooks',
      ],
      popular: false,
      buttonText: 'Choose Starter'
    },
    {
      id: 'professional',
      name: 'Growth',
      price: 69,
      creations: 50,
      features: [
        '50 video creations per month',
        '50+ realistic AI creators',
        'Most realistic results',
        'Processed in 2 minutes',
        'Custom AI hooks',
        'Create content in bulk'
      ],
      popular: true,
      buttonText: 'Choose Growth'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-[min(95vw,900px)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h3 className="text-lg font-semibold">Choose a plan to generate your video</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                    <div className="mb-2 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-semibold">{plan.creations}</span> video creations
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-50 ${
                      plan.popular ? 'bg-black text-white hover:bg-gray-800 shadow-lg' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {isProcessing && selectedPlan === plan.id ? 'Redirecting…' : plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;


