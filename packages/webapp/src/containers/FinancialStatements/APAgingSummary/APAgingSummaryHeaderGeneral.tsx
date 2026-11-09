import React from 'react';
import { APAgingSummaryGeneralProvider } from './APAgingSummaryGeneralProvider';
import { APAgingSummaryHeaderGeneralContent } from './APAgingSummaryHeaderGeneralContent';

export function APAgingSummaryHeaderGeneral() {
  return (
    <APAgingSummaryGeneralProvider>
      <APAgingSummaryHeaderGeneralContent />
    </APAgingSummaryGeneralProvider>
  );
}
