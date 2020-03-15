import React from 'react';
import {Spinner} from '@blueprintjs/core';

export default function LoadingIndicator({
  loading,
  spinnerSize = 40,
  children
}) {
  return (
    <>
      { (loading) ? (
        <div class="dashboard__loading-indicator">
          <Spinner size={spinnerSize} value={null} />
        </div>) : children }
    </>
  );
}