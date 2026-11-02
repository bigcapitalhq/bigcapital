import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ExtensionSlotErrorBoundaryProps {
  extensionId: string;
  children: React.ReactNode;
}

/**
 * Isolates a single extension slot contribution.
 *
 * A crashing contribution renders nothing in production (and a compact message
 * in development) instead of taking down the host page.
 */
export function ExtensionSlotErrorBoundary({
  extensionId,
  children,
}: ExtensionSlotErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackRender={() =>
        import.meta.env.DEV ? (
          <div
            style={{
              padding: '8px 10px',
              margin: '4px 0',
              border: '1px solid #db3737',
              borderRadius: 4,
              color: '#db3737',
              fontSize: 12,
            }}
          >
            Extension “{extensionId}” failed to render this slot.
          </div>
        ) : null
      }
      onError={(error) => {
        console.error(`[extension:${extensionId}] slot render failed`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
