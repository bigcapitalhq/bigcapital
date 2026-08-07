import React from 'react';
import intl from 'react-intl-universal';
import type { BillPayment } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { usePaymentMade } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

/**
 * Each entry's `bill` is typed `any` in the SDK DTO; declare the slice the
 * drawer's columns actually read.
 */
export type BillPaymentDetailEntry = BillPayment['entries'][number] & {
  bill?: {
    billNo?: string;
    formattedBillDate?: string;
    formattedDueDate?: string;
    totalFormatted?: string;
    dueAmountFormatted?: string;
  };
  paymentAmountFormatted?: string;
};

/**
 * Formatted/derived fields the OpenAPI `BillPayment` schema does not
 * surface but the backend returns and the detail drawer consumes.
 */
export interface BillPaymentDetail extends Omit<BillPayment, 'entries'> {
  vendor?: { displayName?: string };
  paymentAccount?: { name?: string };
  branch?: { name?: string };
  entries: BillPaymentDetailEntry[];
}

export interface PaymentMadeDetailDrawerContextValue {
  paymentMadeId: number | undefined;
  paymentMade: BillPaymentDetail | undefined;
  isPaymentFetching?: boolean;
}

interface PaymentMadeDetailProviderProps {
  paymentMadeId: number | undefined;
}

const PaymentMadeDetailContext = React.createContext<
  PaymentMadeDetailDrawerContextValue | undefined
>(undefined);

/**
 * Payment made detail provider.
 */
function PaymentMadeDetailProvider({
  paymentMadeId,
  ...props
}: PaymentMadeDetailProviderProps & { children?: React.ReactNode }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetches specific payment made details.
  const {
    data,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentMade(paymentMadeId, {
    enabled: !!paymentMadeId,
  });
  const paymentMade = data as BillPaymentDetail | undefined;

  // Provider.
  const provider: PaymentMadeDetailDrawerContextValue = {
    paymentMadeId,
    paymentMade,
    isPaymentFetching,
  };

  return (
    <DrawerLoading loading={isPaymentLoading}>
      <DrawerHeaderContent
        name={DRAWERS.PAYMENT_MADE_DETAILS}
        title={intl.get('payment_made.drawer.title', {
          number: paymentMade?.paymentNumber,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('payment_made.drawer.subtitle', {
                value: paymentMade?.branch?.name,
              })
            : null
        }
      />
      <PaymentMadeDetailContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const usePaymentMadeDetailContext = (): PaymentMadeDetailDrawerContextValue => {
  const ctx = React.useContext(PaymentMadeDetailContext);
  if (ctx === undefined) {
    throw new Error(
      'usePaymentMadeDetailContext must be used within a PaymentMadeDetailProvider',
    );
  }
  return ctx;
};

export { PaymentMadeDetailProvider, usePaymentMadeDetailContext };
