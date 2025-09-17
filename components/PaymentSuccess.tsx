import React, { useEffect, useState } from 'react';
import { handleSuccessfulPayment } from '../services/stripeService';

interface PaymentSuccessProps {
  sessionId?: string;
  planId?: string;
  onContinue: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ sessionId, planId, onContinue }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setVerificationError('No session ID provided');
        setIsVerifying(false);
        return;
      }

      try {
        const result = await handleSuccessfulPayment(sessionId);
        if (!result.success) {
          setVerificationError('Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setVerificationError('Error verifying payment');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const getPlanName = (planId?: string) => {
    switch (planId) {
      case 'basic':
        return 'Basic';
      case 'starter':
        return 'Starter';
      case 'professional':
        return 'Growth';
      default:
        return 'Premium';
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your subscription.</p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{verificationError}</p>
          <button
            onClick={onContinue}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful! 🎉</h1>
        <p className="text-lg text-gray-600 mb-2">
          Welcome to the <span className="font-semibold">{getPlanName(planId)} Plan</span>
        </p>
        <p className="text-gray-500 mb-8">
          Your subscription is now active and you can start creating amazing AI videos.
        </p>

        {/* Features Unlocked */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">✨ What's unlocked:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {planId === 'basic' && (
              <>
                <li>• 10 AI video creations per month</li>
                <li>• HD quality videos</li>
                <li>• Access to core AI creators</li>
                <li>• Email support</li>
              </>
            )}
            {planId === 'starter' && (
              <>
                <li>• 30 AI video creations per month</li>
                <li>• HD quality videos</li>
                <li>• 50+ realistic AI avatars</li>
                <li>• Custom AI hooks</li>
              </>
            )}
            {planId === 'professional' && (
              <>
                <li>• 50 AI video creations per month</li>
                <li>• HD & 4K quality videos</li>
                <li>• Premium AI avatars</li>
                <li>• Advanced voice cloning</li>
                <li>• Priority support</li>
              </>
            )}
          </ul>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all transform hover:scale-105"
        >
          Start Creating Videos
        </button>

        {/* Support Link */}
        <p className="text-sm text-gray-500 mt-4">
          Questions? Contact us at{' '}
          <a href="mailto:support@buzzugc.com" className="text-black hover:underline">
            support@buzzugc.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
