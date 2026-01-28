import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Check index.html.");
}

const root = createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Rendering error:", error);
  rootElement.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444;">
    <h2>Application Error</h2>
    <p>Something went wrong during startup. Please refresh the page.</p>
  </div>`;
}
