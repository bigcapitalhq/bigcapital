// @ts-nocheck
import React from 'react';
import { ARAgingSummaryGeneralProvider } from './ARAgingSummaryGeneralProvider';
import ARAgingSummaryHeaderGeneralContent from './ARAgingSummaryHeaderGeneralContent';

/**
 * AR Aging Summary - Drawer Header - General Fields - Content.
 */
export default function ARAgingSummaryHeaderGeneral() {
  return (
    <ARAgingSummaryGeneralProvider>
      <ARAgingSummaryHeaderGeneralContent />
    </ARAgingSummaryGeneralProvider>
  );
}
