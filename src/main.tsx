/**
 * Main entry point for the ChronoCanvas application.
 * 
 * This file initializes the React application and renders the root component.
 * It sets up the necessary providers and global styles.
 * 
 * @module main
 */

import React, { ErrorBoundary } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './components/UI/IconFix.css';

// Error Fallback Component to help debug blank screen issues
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div role="alert" style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid red',
      borderRadius: '4px',
      backgroundColor: '#fff8f8'
    }}>
      <h2 style={{ color: 'red' }}>Something went wrong:</h2>
      <pre style={{ 
        padding: '10px', 
        backgroundColor: '#f8f8f8', 
        overflow: 'auto',
        maxHeight: '300px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        {error.message}
        {'\n\n'}
        {error.stack}
      </pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Try again
      </button>
    </div>
  );
};

// Custom Error Boundary Class
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error as Error} 
        resetErrorBoundary={() => this.setState({ hasError: false, error: null })} 
      />;
    }

    return this.props.children;
  }
}

/**
 * Render the application to the DOM.
 * 
 * Uses React 18's createRoot API for concurrent rendering capabilities.
 * Wraps the App component with any necessary providers.
 * Renders in strict mode for additional development checks.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
