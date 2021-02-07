import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import {
  useResourceViews,
  useResourceFields,
  usePaymentReceives,
} from 'hooks/query';

const PaymentMadesListContext = createContext();

/**
 * Accounts chart data provider.
 */
function PaymentMadesListProvider({ accountsTableQuery, ...props }) {
  // Fetch accounts resource views and fields.
  const {
    data: paymentMadesViews,
    isFetching: isViewsLoading,
  } = useResourceViews('bill_payments');

  // Fetch the accounts resource fields.
  const {
    data: paymentMadesFields,
    isFetching: isFieldsLoading,
  } = useResourceFields('bill_payments');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { paymentMades, pagination },
    isFetching: isInvoicesLoading,
  } = usePaymentReceives(accountsTableQuery);

  // Provider payload.
  const provider = {
    paymentMades,
    pagination,
    paymentMadesFields,
    paymentMadesViews,

    isInvoicesLoading,
    isFieldsLoading,
    isViewsLoading,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'payment-mades-list'}
    >
      <PaymentMadesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentMadesListContext = () =>
  React.useContext(PaymentMadesListContext);

export { PaymentMadesListProvider, usePaymentMadesListContext };
