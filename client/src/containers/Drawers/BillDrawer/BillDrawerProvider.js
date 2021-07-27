import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';
import { useBillLocatedLandedCost } from 'hooks/query';

const BillDrawerContext = React.createContext();

/**
 * Bill drawer provider.
 */
function BillDrawerProvider({ billId, ...props }) {
  // Handle fetch bill located landed cost transaction.
  const { isLoading: isLandedCostLoading, data: transactions } =
    useBillLocatedLandedCost(billId, {
      enabled: !!billId,
    });

  //provider.
  const provider = {
    transactions,
    billId,
  };

  return (
    <DashboardInsider loading={isLandedCostLoading}>
      <DrawerHeaderContent
        name="bill-drawer"
        title={intl.get('bill_details')}
      />
      <BillDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBillDrawerContext = () => React.useContext(BillDrawerContext);

export { BillDrawerProvider, useBillDrawerContext };
