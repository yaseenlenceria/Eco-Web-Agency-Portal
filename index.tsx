import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SimpleApp from './SimpleApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Toggle between App (with Convex) and SimpleApp (Firebase only)
// Use SimpleApp for testing if Convex is not configured
const useSimpleAuth = true; // Set to false when Convex is properly configured

root.render(
  <React.StrictMode>
    {useSimpleAuth ? <SimpleApp /> : <App />}
  </React.StrictMode>
);
