
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import HomePage from './pages/HomePage';
import { Analytics } from '@vercel/analytics/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const target = (import.meta as any).env?.VITE_DEPLOY_TARGET as string | undefined;

root.render(
  <React.StrictMode>
    {target === 'marketing' ? <HomePage /> : <App />}
    <Analytics />
  </React.StrictMode>
);
