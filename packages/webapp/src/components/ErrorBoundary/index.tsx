// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';

function ErrorBoundary({
  error,
  errorInfo,
  children
}) {

  if (errorInfo) {
    return (
      <div>
        <h2>Something went wrong.</h2>

        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {errorInfo.componentStack}
        </details>
      </div>
    );
  }
  return children;
}

ErrorBoundary.defaultProps = {
  children: null,
};

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;