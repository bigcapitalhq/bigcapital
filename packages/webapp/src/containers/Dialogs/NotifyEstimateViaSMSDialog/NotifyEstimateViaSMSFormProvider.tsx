import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import {
  useCreateNotifyEstimateBySMS,
  useEstimateSMSDetail,
} from '@/hooks/query';

interface NotifyEstimateViaSMSContextValue {
  estimateId: number | null;
  dialogName: string;
  estimateSMSDetail: Record<string, unknown>;
  createNotifyEstimateBySMSMutate: ReturnType<
    typeof useCreateNotifyEstimateBySMS
  >['mutateAsync'];
}

const NotifyEstimateViaSMSContext =
  createContext<NotifyEstimateViaSMSContextValue>(
    {} as NotifyEstimateViaSMSContextValue,
  );

interface NotifyEstimateViaSMSFormProviderProps {
  estimateId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

function NotifyEstimateViaSMSFormProvider({
  estimateId,
  dialogName,
  ...props
}: NotifyEstimateViaSMSFormProviderProps) {
  const { data: estimateSMSDetailRaw, isLoading: isEstimateSMSDetailLoading } =
    useEstimateSMSDetail(estimateId, {
      enabled: !!estimateId,
    });
  const estimateSMSDetail =
    (estimateSMSDetailRaw as Record<string, unknown> | undefined) ?? {};

  // Create notfiy estimate by sms mutations.
  const { mutateAsync: createNotifyEstimateBySMSMutate } =
    useCreateNotifyEstimateBySMS();

  // State provider.
  const provider: NotifyEstimateViaSMSContextValue = {
    estimateId: estimateId ?? null,
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
