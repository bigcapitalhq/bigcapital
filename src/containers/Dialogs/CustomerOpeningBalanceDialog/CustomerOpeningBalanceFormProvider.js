import React from 'react';
import { DialogContent } from 'components';
import {
  useBranches,
  useCustomer,
  useEditCustomerOpeningBalance,
} from 'hooks/query';
import { useFeatureCan } from 'hooks/state';
import { Features } from 'common';
import { pick } from 'lodash';

const CustomerOpeningBalanceContext = React.createContext();

/**
 * Customer opening balance provider.
 * @returns
 */
function CustomerOpeningBalanceFormProvider({
  query,
  customerId,
  dialogName,
  ...props
}) {
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
  const provider = {
    branches,
    customer: {
      ...pick(customer, [
        'id',
        'opening_balance',
        'opening_balance_exchange_rate',
        'currency_code',
      ]),
      // opening_balance_at: customer.formatted_opening_balance_at,
    },

    isBranchesSuccess,
    isBranchesLoading,
    dialogName,
    editCustomerOpeningBalanceMutate,
  };

  return (
    <DialogContent isLoading={isBranchesLoading || isCustomerLoading}>
      <CustomerOpeningBalanceContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useCustomerOpeningBalanceContext = () =>
  React.useContext(CustomerOpeningBalanceContext);

export { CustomerOpeningBalanceFormProvider, useCustomerOpeningBalanceContext };
