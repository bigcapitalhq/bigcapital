// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { usePaymentReceive } from '@/hooks/query';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { DRAWERS } from '@/constants/drawers';

const PaymentReceiveDetailContext = React.createContext();

/**
 * Payment receive detail provider.
 */
function PaymentReceiveDetailProvider({ paymentReceiveId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetches specific payment receive details.
  const {
    data: paymentReceive,
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceive(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });

  // Provider.
  const provider = {
    isPaymentFetching,
    paymentReceive,
    paymentReceiveId,
  };

  return (
    <DrawerLoading loading={isPaymentLoading}>
      <DrawerHeaderContent
        name={DRAWERS.PAYMENT_RECEIVED_DETAILS}
        title={intl.get('payment_received.drawer.title', {
          number: paymentReceive.payment_receive_no,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('payment_received.drawer.subtitle', {
                value: paymentReceive.branch?.name,
              })
            : null
        }
      />
      <PaymentReceiveDetailContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const usePaymentReceiveDetailContext = () =>
  React.useContext(PaymentReceiveDetailContext);

export { PaymentReceiveDetailProvider, usePaymentReceiveDetailContext };
