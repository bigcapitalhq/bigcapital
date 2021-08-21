import React from 'react';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import EstimateDetail from './EstimateDetail';
import { EstimateDetailDrawerProvider } from './EstimateDetailDrawerProvider';

/**
 * Estimate detail drawer content.
 */
export default function EstimateDetailDrawerContent({
  // #ownProp
  estimate,
}) {
  return (
    <EstimateDetailDrawerProvider estimateId={estimate}>
      <EstimateDetail />
    </EstimateDetailDrawerProvider>
  );
}
