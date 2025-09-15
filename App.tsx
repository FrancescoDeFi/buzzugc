
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
  const [path, setPath] = useState<string>(window.location.pathname);

  // Simple path-based routing
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setPath(to);
    }
  }, []);

  // Unified handler: skip pricing and go to creation hub
  const handleSkipAndGoHome = useCallback(() => {
    setShowPricingPaywall(false);
    setShowHomePage(false);
    navigate('/');
  }, [navigate]);

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
    // Complete OAuth flow if redirected back with a code/token
    supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {
      // ignore if no code present
    });

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = { 
          username: session.user.email ?? 'user',
          subscriptionStatus: 'active' as const // This would come from your database in production
        };
        setUser(userData);
        setShowHomePage(false);
        
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
        setShowHomePage(false);
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
    // If route is /pricing, show pricing page directly (public URL)
    if (path === '/pricing') {
      return <PricingPaywall onSelectPlan={() => {}} onSkip={handleSkipAndGoHome} />;
    }
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

  if ((showPricingPaywall && user && !selectedPlan) || path === '/pricing') {
    return <PricingPaywall onSelectPlan={handleSelectPlan} onSkip={handleSkipAndGoHome} />;
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
