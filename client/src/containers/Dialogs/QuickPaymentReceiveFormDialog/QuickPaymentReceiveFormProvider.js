import React, { useContext, createContext } from 'react';
import { pick } from 'lodash';
import { DialogContent } from 'components';
import { useAccounts, useInvoice, useCreatePaymentReceive } from 'hooks/query';

const QuickPaymentReceiveContext = createContext();

/**
 * Quick payment receive dialog provider.
 */
function QuickPaymentReceiveFormProvider({ invoiceId, dialogName, ...props }) {
  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Handle fetch invoice data.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Create and edit payment receive mutations.
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  // State provider.
  const provider = {
    accounts,
    invoice: {
      ...pick(invoice, ['id', 'due_amount', 'customer', 'currency_code']),
      customer_id: invoice?.customer?.display_name,
      payment_amount: invoice.due_amount,
    },

    isAccountsLoading,
    dialogName,

    createPaymentReceiveMutate,
  };

  return (
    <DialogContent isLoading={isAccountsLoading || isInvoiceLoading}>
      <QuickPaymentReceiveContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useQuickPaymentReceiveContext = () =>
  useContext(QuickPaymentReceiveContext);

export { QuickPaymentReceiveFormProvider, useQuickPaymentReceiveContext };
