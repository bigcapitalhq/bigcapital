import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';
import { useTransactionsByReference } from 'hooks/query';

const PaymentReceiveDetailContext = React.createContext();

/**
 * Payment receive detail provider.
 */
function PaymentReceiveDetailProvider({ paymentReceiveId, ...props }) {

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      reference_id: paymentReceiveId,
      reference_type: 'paymentReceive',
    },
    { enabled: !!paymentReceiveId },
  );

  //provider.
  const provider = { data };

  return (
    <DashboardInsider loading={isTransactionLoading}>
      <DrawerHeaderContent
        name="payment-receive-detail-drawer"
        title={intl.get('payment_receive_details')}
      />
      <PaymentReceiveDetailContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceiveDetailContext = () =>
  React.useContext(PaymentReceiveDetailContext);

export { PaymentReceiveDetailProvider, usePaymentReceiveDetailContext };
