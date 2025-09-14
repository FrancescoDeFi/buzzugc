
import React, { useState, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import CreationHub from './pages/CreationHub';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showHomePage, setShowHomePage] = useState(true);

  const handleLogin = useCallback((username: string) => {
    setUser({ username });
    setShowHomePage(false);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setShowHomePage(true);
  }, []);

  const handleNavigateToLogin = useCallback(() => {
    setShowHomePage(false);
  }, []);

  if (showHomePage && !user) {
    return <HomePage onNavigateToLogin={handleNavigateToLogin} />;
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
