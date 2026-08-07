import React from 'react';
import intl from 'react-intl-universal';
import type { Bill, BillLandedCostTransaction } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { useBill, useBillLocatedLandedCost } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

export interface BillDrawerContextValue {
  billId: number | undefined;
  bill: Bill | undefined;
  transactions: BillLandedCostTransaction[] | undefined;
}

interface BillDrawerProviderProps {
  billId: number | undefined;
}

const BillDrawerContext = React.createContext<
  BillDrawerContextValue | undefined
>(undefined);

/**
 * Bill drawer provider.
 */
function BillDrawerProvider({
  billId,
  ...props
}: BillDrawerProviderProps & { children?: React.ReactNode }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

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
  const provider: BillDrawerContextValue = {
    billId,
    transactions,
    bill,
  };

  const loading = isLandedCostLoading || isBillLoading;

  return (
    <DrawerLoading loading={loading}>
      <DrawerHeaderContent
        name={DRAWERS.BILL_DETAILS}
        title={intl.get('bill.drawer.title', {
          number: bill?.billNumber ? `(${bill.billNumber})` : null,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('bill.drawer.subtitle', {
                value: bill?.branch?.name,
              })
            : null
        }
      />
      <BillDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useBillDrawerContext = (): BillDrawerContextValue => {
  const ctx = React.useContext(BillDrawerContext);
  if (ctx === undefined) {
    throw new Error(
      'useBillDrawerContext must be used within a BillDrawerProvider',
    );
  }
  return ctx;
};

export { BillDrawerProvider, useBillDrawerContext };
