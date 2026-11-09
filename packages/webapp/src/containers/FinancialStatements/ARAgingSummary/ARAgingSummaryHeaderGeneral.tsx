import React from 'react';
import { ARAgingSummaryGeneralProvider } from './ARAgingSummaryGeneralProvider';
import { ARAgingSummaryHeaderGeneralContent } from './ARAgingSummaryHeaderGeneralContent';

export function ARAgingSummaryHeaderGeneral() {
  return (
    <ARAgingSummaryGeneralProvider>
      <ARAgingSummaryHeaderGeneralContent />
    </ARAgingSummaryGeneralProvider>
  );
}
