import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import {
  useCreateNotifyInvoiceBySMS,
  useInvoiceSMSDetail,
} from '@/hooks/query';

interface NotifyInvoiceViaSMSContextValue {
  invoiceId: number | null;
  invoiceSMSDetail: Record<string, unknown>;
  dialogName: string;
  createNotifyInvoiceBySMSMutate: ReturnType<
    typeof useCreateNotifyInvoiceBySMS
  >['mutateAsync'];
  notificationType: string;
  setNotificationType: (next: string) => void;
}

const NotifyInvoiceViaSMSContext =
  createContext<NotifyInvoiceViaSMSContextValue>(
    {} as NotifyInvoiceViaSMSContextValue,
  );

interface NotifyInvoiceViaSMSFormProviderProps {
  invoiceId?: number | null;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Invoice SMS notification provider.
 */
function NotifyInvoiceViaSMSFormProvider({
  invoiceId,
  dialogName,
  ...props
}: NotifyInvoiceViaSMSFormProviderProps) {
  const [notificationType, setNotificationType] = React.useState('details');

  // Retrieve the invoice sms notification message details. The hook returns
  // `unknown` from the SDK; cast narrow.
  const { data: invoiceSMSDetailRaw, isLoading: isInvoiceSMSDetailLoading } =
    useInvoiceSMSDetail(
      // Hook signature requires `number`; provider may receive null when
      // dialog is closed. Cast to satisfy TS — runtime guards via `enabled`.
      invoiceId as number,
      {
        notification_key: notificationType,
      },
      {
        enabled: !!invoiceId,
        keepPreviousData: true,
      },
    );
  const invoiceSMSDetail =
    (invoiceSMSDetailRaw as Record<string, unknown> | undefined) ?? {};

  // Create notfiy invoice by sms mutations.
  const { mutateAsync: createNotifyInvoiceBySMSMutate } =
    useCreateNotifyInvoiceBySMS();

  // State provider.
  const provider: NotifyInvoiceViaSMSContextValue = {
    invoiceId: invoiceId ?? null,
    invoiceSMSDetail,
    dialogName,
    createNotifyInvoiceBySMSMutate,
    notificationType,
    setNotificationType,
  };

  return (
    <DialogContent isLoading={isInvoiceSMSDetailLoading}>
      <NotifyInvoiceViaSMSContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useNotifyInvoiceViaSMSContext = () =>
  React.useContext(NotifyInvoiceViaSMSContext);

export { NotifyInvoiceViaSMSFormProvider, useNotifyInvoiceViaSMSContext };
