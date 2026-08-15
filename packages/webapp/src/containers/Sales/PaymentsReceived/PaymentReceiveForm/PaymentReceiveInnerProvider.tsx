import { useFormikContext } from 'formik';
import React, { createContext, useContext, useEffect } from 'react';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import {
  transformInvoicesNewPageEntries,
  type PaymentReceiveFormValues,
} from './utils';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useDueInvoices } from '@/hooks/query';

type DueInvoice = {
  id: string | number;
  due_amount: string | number;
  invoice_date: string;
  balance: string | number;
  currency_code: string;
  invoice_no: string;
  branch_id: string | number;
  payment_amount?: string | number;
};

interface PaymentReceiveInnerContextValue {
  dueInvoices: DueInvoice[] | undefined;
  isDueInvoicesLoading: boolean;
  isDueInvoicesFetching: boolean;
}

const PaymentReceiveInnerContext = createContext<
  PaymentReceiveInnerContextValue | undefined
>(undefined);

/**
 * Payment receive inner form provider.
 */
function PaymentReceiveInnerProvider({
  ...props
}: {
  children?: React.ReactNode;
}) {
  const { isNewMode } = usePaymentReceiveFormContext();

  const {
    values: { customerId },
    setFieldValue,
  } = useFormikContext<PaymentReceiveFormValues>();

  // `useDueInvoices` types its options as a full UseQueryOptions (which requires queryKey/queryFn),
  // but it supplies those internally — so we pass only the partial options.
  const dueInvoicesQuery = {
    enabled: !!customerId && isNewMode,
  } as UseQueryOptions<unknown, Error>;

  const {
    data: dueInvoices,
    isLoading: isDueInvoicesLoading,
    isFetching: isDueInvoicesFetching,
  } = useDueInvoices(customerId as number | undefined, dueInvoicesQuery);

  useEffect(() => {
    if (!isDueInvoicesFetching && isNewMode) {
      if (dueInvoices) {
        const transformed = transformInvoicesNewPageEntries(
          dueInvoices as DueInvoice[],
        );
        setFieldValue('entries', transformed);
      } else if (!customerId) {
        setFieldValue('entries', []);
      }
    }
  }, [
    isDueInvoicesFetching,
    dueInvoices,
    isNewMode,
    customerId,
    setFieldValue,
  ]);

  const provider: PaymentReceiveInnerContextValue = {
    dueInvoices: dueInvoices as DueInvoice[] | undefined,
    isDueInvoicesLoading,
    isDueInvoicesFetching,
  };

  return <PaymentReceiveInnerContext.Provider value={provider} {...props} />;
}

const usePaymentReceiveInnerContext = (): PaymentReceiveInnerContextValue => {
  const ctx = useContext(PaymentReceiveInnerContext);
  if (!ctx) {
    throw new Error(
      'usePaymentReceiveInnerContext must be used within a PaymentReceiveInnerProvider',
    );
  }
  return ctx;
};

export { PaymentReceiveInnerProvider, usePaymentReceiveInnerContext };
