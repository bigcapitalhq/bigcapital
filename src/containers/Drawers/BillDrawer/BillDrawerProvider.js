import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import {
  useBill,
  useTransactionsByReference,
  useBillLocatedLandedCost,
} from 'hooks/query';

const BillDrawerContext = React.createContext();

/**
 * Bill drawer provider.
 */
function BillDrawerProvider({ billId, ...props }) {
  // Handle fetch bill details.
  const { isLoading: isBillLoading, data: bill } = useBill(billId, {
    enabled: !!billId,
  });

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      reference_id: billId,
      reference_type: 'Bill',
    },
    { enabled: !!billId },
  );

  // Handle fetch bill located landed cost transaction.
  const { isLoading: isLandedCostLoading, data: transactions } =
    useBillLocatedLandedCost(billId, {
      enabled: !!billId,
    });

  //provider.
  const provider = {
    transactions,
    billId,
    data,
    bill,
  };

  const loading = isLandedCostLoading || isTransactionLoading || isBillLoading;

  return (
    <DrawerLoading loading={loading}>
      <DrawerHeaderContent
        name="bill-drawer"
        title={intl.get('bill_details')}
      />
      <BillDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useBillDrawerContext = () => React.useContext(BillDrawerContext);

export { BillDrawerProvider, useBillDrawerContext };
