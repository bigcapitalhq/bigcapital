import React from 'react';

/**
 * FallbackComponent for displaying a loading state.
 * This can be customized to fit the design of your application.
 */
const FallbackComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <svg style={{ animation: 'spin 1s linear infinite' }} width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#333" strokeDasharray="31.415, 31.415" strokeLinecap="round" />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  </div>
);

export default FallbackComponent;
