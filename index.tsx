import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Mounting Error:", error);
    container.innerHTML = `<div style="padding: 40px; text-align: center; color: #ef4444; font-family: sans-serif;">
      <h1>Failed to load application</h1>
      <p>Please refresh the page or contact support.</p>
    </div>`;
  }
} else {
  console.error("Critical Error: Root element not found in HTML.");
}