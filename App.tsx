
import React, { useState, useCallback, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import CreationHub from './pages/CreationHub';
import HomePage from './pages/HomePage';
import PricingPaywall from './pages/PricingPaywall';
import PaymentSuccess from './components/PaymentSuccess';
import Header from './components/Header';
import type { User } from './types';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showHomePage, setShowHomePage] = useState(true);
  const [showPricingPaywall, setShowPricingPaywall] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);

  // Check URL parameters for payment success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const planId = urlParams.get('plan');
    
    if (success === 'true' && sessionId) {
      setShowPaymentSuccess(true);
      setPaymentSessionId(sessionId);
      if (planId) {
        setSelectedPlan(planId);
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Hydrate from Supabase session and listen for auth changes
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = { 
          username: session.user.email ?? 'user',
          subscriptionStatus: 'active' as const // This would come from your database in production
        };
        setUser(userData);
        
        // Don't show pricing paywall if payment was successful
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') !== 'true') {
          setShowPricingPaywall(true);
        }
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ username: session.user.email ?? 'user' });
        setShowPricingPaywall(true);
      } else {
        setUser(null);
        setShowHomePage(true);
        setShowPricingPaywall(false);
        setSelectedPlan(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = useCallback((username: string) => {
    setUser({ username });
    setShowHomePage(false);
    setShowPricingPaywall(true); // Show pricing paywall after login
  }, []);

  const handleLogout = useCallback(() => {
    // Fire-and-forget Supabase sign out; auth listener will reset UI
    supabase.auth.signOut();
    setUser(null);
    setShowHomePage(true);
    setShowPricingPaywall(false);
    setSelectedPlan(null);
  }, []);

  const handleNavigateToLogin = useCallback(() => {
    setShowHomePage(false);
  }, []);

  const handleSelectPlan = useCallback((planId: string) => {
    setSelectedPlan(planId);
    setShowPricingPaywall(false);
  }, []);

  const handleSkipPricing = useCallback(() => {
    setShowPricingPaywall(false);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    setShowPaymentSuccess(false);
    setShowPricingPaywall(false);
  }, []);

  if (showHomePage) {
    return <HomePage onNavigateToLogin={handleNavigateToLogin} />;
  }

  if (showPaymentSuccess) {
    return (
      <PaymentSuccess 
        sessionId={paymentSessionId || undefined}
        planId={selectedPlan || undefined}
        onContinue={handlePaymentSuccess}
      />
    );
  }

  if (showPricingPaywall && user && !selectedPlan) {
    return <PricingPaywall onSelectPlan={handleSelectPlan} onSkip={handleSkipPricing} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {user ? (
        <>
          <Header user={user} onLogout={handleLogout} />
          <main>
            <CreationHub />
          </main>
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
