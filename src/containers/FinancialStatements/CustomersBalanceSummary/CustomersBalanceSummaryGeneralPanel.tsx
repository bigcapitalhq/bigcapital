// @ts-nocheck
import React from 'react';
import CustomersBalanceSummaryGeneralPanelContent from './CustomersBalanceSummaryGeneralPanelContent';
import { CustomersBalanceSummaryGeneralProvider } from './CustomersBalanceSummaryGeneralProvider';

/**
 * Customers balance header - General panel.
 */
export default function CustomersBalanceSummaryGeneralPanel() {
  return (
    <CustomersBalanceSummaryGeneralProvider>
      <CustomersBalanceSummaryGeneralPanelContent />
    </CustomersBalanceSummaryGeneralProvider>
  );
}
