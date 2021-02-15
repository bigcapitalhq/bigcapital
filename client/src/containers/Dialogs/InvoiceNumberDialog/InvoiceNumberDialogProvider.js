import React, { createContext, useContext } from 'react';
import { DialogContent } from 'components';
import { useSettings } from 'hooks/query';

const InvoiceNumberDialogContext = createContext();

/**
 * Invoice number dialog provider.
 */
function InvoiceNumberDialogProvider({ query, ...props }) {
  const { isLoading } = useSettings();

  // Provider payload.
  const provider = {
      
  };

  return (
    <DialogContent isLoading={isLoading}>
      <InvoiceNumberDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useInvoiceNumberDialogContext = () =>
  useContext(InvoiceNumberDialogContext);

export { InvoiceNumberDialogProvider, useInvoiceNumberDialogContext };
