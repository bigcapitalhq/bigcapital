import React from 'react';

import { EasySMSIntegrationProvider } from './EasySMSIntegrationProvider';
import EasySMSIntegrationForm from './EasySMSIntegrationForm';

/**
 * EasySMS integration dialog content.
 */
export default function EasySMSIntegrationDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <EasySMSIntegrationProvider dialogName={dialogName}>
      <EasySMSIntegrationForm />
    </EasySMSIntegrationProvider>
  );
}
