import React, { createContext, useContext } from 'react';
import { DialogContent } from '@/components';
import { useSettingsInvoices } from '@/hooks/query';

interface InvoiceNumberDialogContextValue {
  isSettingsLoading: boolean;
}

const InvoiceNumberDialogContext =
  createContext<InvoiceNumberDialogContextValue>(
    {} as InvoiceNumberDialogContextValue,
  );

interface InvoiceNumberDialogProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 * Invoice number dialog provider.
 */
function InvoiceNumberDialogProvider({
  ...props
}: InvoiceNumberDialogProviderProps) {
  const { isLoading: isSettingsLoading } = useSettingsInvoices();

  // Provider payload.
  const provider: InvoiceNumberDialogContextValue = {
    isSettingsLoading,
  };

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <InvoiceNumberDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useInvoiceNumberDialogContext = () =>
  useContext(InvoiceNumberDialogContext);

export { InvoiceNumberDialogProvider, useInvoiceNumberDialogContext };
