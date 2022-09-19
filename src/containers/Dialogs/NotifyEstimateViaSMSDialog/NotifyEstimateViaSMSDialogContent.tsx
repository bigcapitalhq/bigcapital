// @ts-nocheck
import React from 'react';
import { NotifyEstimateViaSMSFormProvider } from './NotifyEstimateViaSMSFormProvider';
import NotifyEstimateViaSMSForm from './NotifyEstimateViaSMSForm';

export default function NotifyEstimateViaSMSDialogContent({
  // #ownProps
  dialogName,
  estimate,
}) {
  return (
    <NotifyEstimateViaSMSFormProvider
      estimateId={estimate}
      dialogName={dialogName}
    >
      <NotifyEstimateViaSMSForm />
    </NotifyEstimateViaSMSFormProvider>
  );
}
