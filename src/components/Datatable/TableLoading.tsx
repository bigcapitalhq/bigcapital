// @ts-nocheck
import React from 'react';
import { Spinner } from '@blueprintjs/core';

/**
 * Table loading component.
 */
export default function TableLoading({
  spinnerProps
}) {
  return (
    <div class="loading">
      <Spinner {...spinnerProps} />
    </div>
  );
}