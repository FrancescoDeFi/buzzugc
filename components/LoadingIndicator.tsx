import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-8">
          <div className="w-full h-full border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Creating Your Video</h3>
        <p className="text-gray-600 text-lg mb-6">{message}</p>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">This may take a few minutes. Please don't close this window.</p>
        </div>

        {/* Progress indicators */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;