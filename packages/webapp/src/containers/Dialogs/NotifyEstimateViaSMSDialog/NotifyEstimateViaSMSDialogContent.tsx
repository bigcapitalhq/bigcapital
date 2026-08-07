import React from 'react';
import { NotifyEstimateViaSMSForm } from './NotifyEstimateViaSMSForm';
import { NotifyEstimateViaSMSFormProvider } from './NotifyEstimateViaSMSFormProvider';

interface NotifyEstimateViaSMSDialogContentProps {
  dialogName: string;
  estimate?: number | null;
}

export function NotifyEstimateViaSMSDialogContent({
  dialogName,
  estimate,
}: NotifyEstimateViaSMSDialogContentProps): React.ReactElement {
  return (
    <NotifyEstimateViaSMSFormProvider
      estimateId={estimate}
      dialogName={dialogName}
    >
      <NotifyEstimateViaSMSForm />
    </NotifyEstimateViaSMSFormProvider>
  );
}
