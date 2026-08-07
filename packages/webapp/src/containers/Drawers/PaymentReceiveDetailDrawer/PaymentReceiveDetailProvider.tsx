import React from 'react';
import intl from 'react-intl-universal';
import type { PaymentReceived } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { usePaymentReceive } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

/**
 * Each entry's `invoice` is typed `any` in the SDK DTO; declare the slice the
 * drawer's columns actually read.
 */
export type PaymentReceiveDetailEntry = PaymentReceived['entries'][number] & {
  invoice?: {
    invoiceNo?: string;
    invoiceDateFormatted?: string;
    totalFormatted?: string;
    dueAmountFormatted?: string;
  };
  paymentAmountFormatted?: string;
};

/**
 * Formatted/derived fields the OpenAPI `PaymentReceived` schema does not
 * surface but the backend returns and the detail drawer consumes.
 */
export interface PaymentReceiveDetail extends Omit<PaymentReceived, 'entries'> {
  customer?: { displayName?: string };
  subtotalFormatted?: string;
  entries: PaymentReceiveDetailEntry[];
}

export interface PaymentReceiveDetailDrawerContextValue {
  paymentReceiveId: number | undefined;
  paymentReceive: PaymentReceiveDetail | undefined;
  isPaymentFetching?: boolean;
}

interface PaymentReceiveDetailProviderProps {
  paymentReceiveId: number | undefined;
}

const PaymentReceiveDetailContext = React.createContext<
  PaymentReceiveDetailDrawerContextValue | undefined
>(undefined);

/**
 * Payment receive detail provider.
 */
function PaymentReceiveDetailProvider({
  paymentReceiveId,
  ...props
}: PaymentReceiveDetailProviderProps & { children?: React.ReactNode }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetches specific payment receive details.
  const {
    data,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceive(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });
  const paymentReceive = data as PaymentReceiveDetail | undefined;

  // Provider.
  const provider: PaymentReceiveDetailDrawerContextValue = {
    paymentReceiveId,
    paymentReceive,
    isPaymentFetching,
  };

  return (
    <DrawerLoading loading={isPaymentLoading}>
      <DrawerHeaderContent
        name={DRAWERS.PAYMENT_RECEIVED_DETAILS}
        title={intl.get('payment_received.drawer.title', {
          number: paymentReceive?.paymentReceiveNo,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('payment_received.drawer.subtitle', {
                value: paymentReceive?.branch?.name,
              })
            : null
        }
      />
      <PaymentReceiveDetailContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const usePaymentReceiveDetailContext =
  (): PaymentReceiveDetailDrawerContextValue => {
    const ctx = React.useContext(PaymentReceiveDetailContext);
    if (ctx === undefined) {
      throw new Error(
        'usePaymentReceiveDetailContext must be used within a PaymentReceiveDetailProvider',
      );
    }
    return ctx;
  };

export { PaymentReceiveDetailProvider, usePaymentReceiveDetailContext };
