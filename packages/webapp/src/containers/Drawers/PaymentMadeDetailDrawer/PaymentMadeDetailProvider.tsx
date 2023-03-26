// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { usePaymentMade } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';

const PaymentMadeDetailContext = React.createContext();

/**
 * Payment made detail provider.
 */
function PaymentMadeDetailProvider({ paymentMadeId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Handle fetch specific payment made details.
  const { data: paymentMade, isLoading: isPaymentMadeLoading } = usePaymentMade(
    paymentMadeId,
    {
      enabled: !!paymentMadeId,
    },
  );
  // Provider state.
  const provider = {
    paymentMadeId,
    paymentMade,
  };

  const loading = isPaymentMadeLoading;

  return (
    <DrawerLoading loading={loading}>
      <DrawerHeaderContent
        name="payment-made-detail-drawer"
        title={intl.get('payment_made.drawer.title', {
          number: paymentMade.payment_number
            ? `(${paymentMade.payment_number})`
            : '',
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('payment_made.drawer.subtitle', {
                value: paymentMade.branch?.name,
              })
            : null
        }
      />
      <PaymentMadeDetailContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const usePaymentMadeDetailContext = () =>
  React.useContext(PaymentMadeDetailContext);
export { PaymentMadeDetailProvider, usePaymentMadeDetailContext };
