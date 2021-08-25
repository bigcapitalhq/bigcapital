import React from 'react';

import EstimateDetail from './EstimateDetail';
import { EstimateDetailDrawerProvider } from './EstimateDetailDrawerProvider';

/**
 * Estimate detail drawer content.
 */
export default function EstimateDetailDrawerContent({
  // #ownProp
  estimateId,
}) {
  return (
    <EstimateDetailDrawerProvider estimateId={estimateId}>
      <EstimateDetail />
    </EstimateDetailDrawerProvider>
  );
}
