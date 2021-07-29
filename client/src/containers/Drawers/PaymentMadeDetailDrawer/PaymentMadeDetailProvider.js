import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';

const PaymentMadeDetailContext = React.createContext();

function PaymentMadeDetailProvider({ paymentMadeId, ...props }) {
  //provider.
  const provider = {};
  return (
    <DashboardInsider>
      <DrawerHeaderContent
        name="payment-made-detail-drawer"
        title={intl.get('payment_made_details')}
      />
      <PaymentMadeDetailContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentMadeDetailContext = () =>
  React.useContext(PaymentMadeDetailContext);
export { PaymentMadeDetailProvider, usePaymentMadeDetailContext };
