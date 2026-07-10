import React from 'react';
import type { Branch } from '@bigcapital/sdk-ts';
import { transfromCustomertoForm } from './utils';
import type { CustomerOpeningBalanceSeed } from './utils';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useBranches,
  useCustomer,
  useEditCustomerOpeningBalance,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type UseEditCustomerOpeningBalanceResult = ReturnType<
  typeof useEditCustomerOpeningBalance
>;

export interface CustomerOpeningBalanceFormContextValue {
  branches: Branch[];
  customer: CustomerOpeningBalanceSeed;
  isBranchesSuccess: boolean;
  isBranchesLoading: boolean;
  dialogName: string;
  editCustomerOpeningBalanceMutate: UseEditCustomerOpeningBalanceResult['mutateAsync'];
}

interface CustomerOpeningBalanceFormProviderProps {
  query?: Record<string, unknown>;
  customerId: number | undefined;
  dialogName: string;
  children?: React.ReactNode;
}

const CustomerOpeningBalanceContext = React.createContext<
  CustomerOpeningBalanceFormContextValue | undefined
>(undefined);

/**
 * Customer opening balance provider.
 */
function CustomerOpeningBalanceFormProvider({
  query,
  customerId,
  dialogName,
  children,
}: CustomerOpeningBalanceFormProviderProps) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  const { mutateAsync: editCustomerOpeningBalanceMutate } =
    useEditCustomerOpeningBalance();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Handle fetch customer details.
  const { data: customer, isLoading: isCustomerLoading } = useCustomer(
    customerId,
    { enabled: !!customerId },
  );

  // State provider.
  const provider: CustomerOpeningBalanceFormContextValue = {
    branches: branches ?? [],
    customer: transfromCustomertoForm(customer),

    isBranchesSuccess,
    isBranchesLoading,
    dialogName,
    editCustomerOpeningBalanceMutate,
  };

  return (
    <DialogContent isLoading={isBranchesLoading || isCustomerLoading}>
      <CustomerOpeningBalanceContext.Provider value={provider}>
        {children}
      </CustomerOpeningBalanceContext.Provider>
    </DialogContent>
  );
}

const useCustomerOpeningBalanceContext =
  (): CustomerOpeningBalanceFormContextValue => {
    const ctx = React.useContext(CustomerOpeningBalanceContext);
    if (!ctx) {
      throw new Error(
        'useCustomerOpeningBalanceContext must be used within CustomerOpeningBalanceFormProvider',
      );
    }
    return ctx;
  };

export { CustomerOpeningBalanceFormProvider, useCustomerOpeningBalanceContext };
