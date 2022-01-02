import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import { useBill, useBillLocatedLandedCost } from 'hooks/query';

const BillDrawerContext = React.createContext();

/**
 * Bill drawer provider.
 */
function BillDrawerProvider({ billId, ...props }) {
  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });

  // Handle fetch bill located landed cost transaction.
  const { isLoading: isLandedCostLoading, data: transactions } =
    useBillLocatedLandedCost(billId, {
      enabled: !!billId,
    });

  //provider.
  const provider = {
    billId,
    transactions,
    bill,
  };

  const loading = isLandedCostLoading || isBillLoading;

  return (
    <DrawerLoading loading={loading}>
      <DrawerHeaderContent
        name="bill-drawer"
        title={intl.get('bill.drawer.title', {
          number: bill.bill_number ? `(${bill.bill_number})` : null,
        })}
      />
      <BillDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useBillDrawerContext = () => React.useContext(BillDrawerContext);

export { BillDrawerProvider, useBillDrawerContext };
