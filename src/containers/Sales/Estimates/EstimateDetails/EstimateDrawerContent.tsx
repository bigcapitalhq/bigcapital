import React from 'react';
import { EstimateDrawerProvider } from './EstimateDrawerProvider';
import EstimatePaper from './EstimatePaper';

/**
 *  Estimate drawer content.
 */
export default function EstimateDrawerContent({
  // #ownProp
  estimateId,
}) {
  return (
    <EstimateDrawerProvider estimateId={estimateId}>
      <EstimatePaper />
    </EstimateDrawerProvider>
  );
}
