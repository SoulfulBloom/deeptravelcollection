// Environment detection
window.__IS_BROWSER__ = true;
window.__IS_SERVER__ = false;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { reportWebVitals } from './utils/web-vitals';

// Create root element if it doesn't exist
const rootElement = document.getElementById('root');
if (!rootElement) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report web vitals metrics
reportWebVitals();