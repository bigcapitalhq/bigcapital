import React from 'react';
import { VendorsBalanceSummaryHeaderGeneralContent } from './VendorsBalanceSummaryHeaderGeneralContent';
import { VendorsBalanceSummaryGeneralPanelProvider } from './VendorsBalanceSummaryHeaderGeneralProvider';

/**
 * Vendors balance header - General panel.
 */
export function VendorsBalanceSummaryHeaderGeneral() {
  return (
    <VendorsBalanceSummaryGeneralPanelProvider>
      <VendorsBalanceSummaryHeaderGeneralContent />
    </VendorsBalanceSummaryGeneralPanelProvider>
  );
}
