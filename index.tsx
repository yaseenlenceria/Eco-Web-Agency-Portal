import React from 'react';
import ReactDOM from 'react-dom/client';
import EmailApp from './EmailApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <EmailApp />
  </React.StrictMode>
);
