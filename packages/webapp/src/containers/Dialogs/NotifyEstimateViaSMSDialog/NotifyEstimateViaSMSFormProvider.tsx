// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import {
  useEstimateSMSDetail,
  useCreateNotifyEstimateBySMS,
} from '@/hooks/query';

const NotifyEstimateViaSMSContext = React.createContext();

function NotifyEstimateViaSMSFormProvider({
  estimateId,
  dialogName,
  ...props
}) {
  const { data: estimateSMSDetail, isLoading: isEstimateSMSDetailLoading } =
    useEstimateSMSDetail(estimateId, {
      enabled: !!estimateId,
    });

  // Create notify estimate by sms mutations.
  const { mutateAsync: createNotifyEstimateBySMSMutate } =
    useCreateNotifyEstimateBySMS();

  // State provider.
  const provider = {
    estimateId,
    dialogName,
    estimateSMSDetail,
    createNotifyEstimateBySMSMutate,
  };

  return (
    <DialogContent isLoading={isEstimateSMSDetailLoading}>
      <NotifyEstimateViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useEstimateViaSMSContext = () =>
  React.useContext(NotifyEstimateViaSMSContext);

export { NotifyEstimateViaSMSFormProvider, useEstimateViaSMSContext };
