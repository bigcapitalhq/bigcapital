// @ts-nocheck
import React from 'react';

import { SMSIntegrationProvider } from './SMSIntegrationProvider';
import SMSIntegrationTabs from './SMSIntegrationTabs';

/**
 * SMS Integration
 */
export default function SMSIntegration() {
  return (
    <SMSIntegrationProvider>
      <SMSIntegrationTabs />
    </SMSIntegrationProvider>
  );
}
