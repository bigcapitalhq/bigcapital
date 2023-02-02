// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { pick } from 'lodash';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import {
  useAccounts,
  useVendorCredit,
  useBranches,
  useCreateRefundVendorCredit,
} from '@/hooks/query';

const RefundVendorCreditContext = React.createContext();

function RefundVendorCreditFormProvider({
  vendorCreditId,
  dialogName,
  query,
  ...props
}) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Handle fetch vendor credit details.
  const { data: vendorCredit, isLoading: isVendorCreditLoading } =
    useVendorCredit(vendorCreditId, {
      enabled: !!vendorCreditId,
    });

  // Create refund vendor credit mutations.
  const { mutateAsync: createRefundVendorCreditMutate } =
    useCreateRefundVendorCredit();

  // State provider.
  const provider = {
    vendorCredit: {
      ...pick(vendorCredit, ['id', 'credits_remaining', 'currency_code']),
      amount: vendorCredit.credits_remaining,
    },
    accounts,
    branches,
    dialogName,
    isBranchesSuccess,
    createRefundVendorCreditMutate,
  };

  return (
    <DialogContent
      isLoading={
        isAccountsLoading || isVendorCreditLoading || isBranchesLoading
      }
    >
      <RefundVendorCreditContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useRefundVendorCreditContext = () =>
  React.useContext(RefundVendorCreditContext);

export { RefundVendorCreditFormProvider, useRefundVendorCreditContext };
