/**
 * Main entry point for the ChronoCanvas application.
 * 
 * This file initializes the React application and renders the root component.
 * It sets up the necessary providers and global styles.
 * 
 * @module main
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './components/UI/IconFix.css';

/**
 * Render the application to the DOM.
 * 
 * Uses React 18's createRoot API for concurrent rendering capabilities.
 * Wraps the App component with any necessary providers.
 * Renders in strict mode for additional development checks.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
