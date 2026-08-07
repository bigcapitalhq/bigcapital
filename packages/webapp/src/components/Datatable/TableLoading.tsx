import { Spinner } from '@blueprintjs/core';
import React from 'react';

interface TableLoadingProps {
  spinnerProps?: Record<string, any>;
}

export default function TableLoading({ spinnerProps }: TableLoadingProps) {
  return (
    <div className="loading">
      <Spinner {...spinnerProps} />
    </div>
  );
}
