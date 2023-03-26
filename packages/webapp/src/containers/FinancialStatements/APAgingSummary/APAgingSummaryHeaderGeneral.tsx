// @ts-nocheck
import React from 'react';
import { APAgingSummaryGeneralProvider } from './APAgingSummaryGeneralProvider';
import APAgingSummaryHeaderGeneralContent from './APAgingSummaryHeaderGeneralContent';

/**
 * AP Aging Summary - Drawer Header - General panel.
 */
export default function APAgingSummaryHeaderGeneral() {
  return (
    <APAgingSummaryGeneralProvider>
      <APAgingSummaryHeaderGeneralContent />
    </APAgingSummaryGeneralProvider>
  );
}
