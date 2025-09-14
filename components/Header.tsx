import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">buzzUGC</span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Projects</a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Analytics</a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium">Settings</a>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-700 font-medium">
                {user.username}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;