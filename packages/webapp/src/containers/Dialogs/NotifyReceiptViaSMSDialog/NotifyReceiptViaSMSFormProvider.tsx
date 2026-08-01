import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import {
  useCreateNotifyReceiptBySMS,
  useReceiptSMSDetail,
} from '@/hooks/query';

interface NotifyReceiptViaSMSContextValue {
  receiptId: number | null;
  dialogName: string;
  receiptSMSDetail: Record<string, unknown>;
  createNotifyReceiptBySMSMutate: ReturnType<
    typeof useCreateNotifyReceiptBySMS
  >['mutateAsync'];
}

const NotifyReceiptViaSMSContext =
  createContext<NotifyReceiptViaSMSContextValue>(
    {} as NotifyReceiptViaSMSContextValue,
  );

interface NotifyReceiptViaSMSFormProviderProps {
  receiptId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

function NotifyReceiptViaSMSFormProvider({
  receiptId,
  dialogName,
  ...props
}: NotifyReceiptViaSMSFormProviderProps) {
  // Create notfiy receipt via SMS mutations.
  const { mutateAsync: createNotifyReceiptBySMSMutate } =
    useCreateNotifyReceiptBySMS();

  // Retrieve the receipt SMS notification details.
  const { data: receiptSMSDetailRaw, isLoading: isReceiptSMSDetailLoading } =
    useReceiptSMSDetail(receiptId as number, {
      enabled: !!receiptId,
    });
  const receiptSMSDetail =
    (receiptSMSDetailRaw as Record<string, unknown> | undefined) ?? {};

  // State provider.
  const provider: NotifyReceiptViaSMSContextValue = {
    receiptId: receiptId ?? null,
    dialogName,
    receiptSMSDetail,
    createNotifyReceiptBySMSMutate,
  };

  return (
    <DialogContent isLoading={isReceiptSMSDetailLoading}>
      <NotifyReceiptViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyReceiptViaSMSContext = () =>
  React.useContext(NotifyReceiptViaSMSContext);

export { NotifyReceiptViaSMSFormProvider, useNotifyReceiptViaSMSContext };
