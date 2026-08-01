import { pick } from 'lodash';
import React, { createContext } from 'react';
import type { RefundVendorCreditContextValue } from './types';
import { DialogContent } from '@/components';
import { Features } from '@/constants';
import {
  useAccounts,
  useBranches,
  useCreateRefundVendorCredit,
  useVendorCredit,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

const RefundVendorCreditContext = createContext<RefundVendorCreditContextValue>(
  {} as RefundVendorCreditContextValue,
);

interface RefundVendorCreditFormProviderProps {
  vendorCreditId?: number | null;
  dialogName: string;
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

function RefundVendorCreditFormProvider({
  vendorCreditId,
  dialogName,
  query,
  ...props
}: RefundVendorCreditFormProviderProps) {
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
  // FIXME: latent bug — `vendorCredit` may be undefined before the query
  // resolves; original code accessed `vendorCredit.creditsRemaining` directly.
  const vendorCreditRaw = vendorCredit as
    | (Record<string, unknown> & { creditsRemaining?: number })
    | undefined;
  const picked = pick(vendorCreditRaw, [
    'id',
    'creditsRemaining',
    'currencyCode',
  ]) as { id?: number; creditsRemaining?: number; currencyCode?: string };

  const provider: RefundVendorCreditContextValue = {
    vendorCredit: vendorCreditRaw
      ? {
          id: picked.id as number,
          creditsRemaining: (picked.creditsRemaining as number) ?? 0,
          currencyCode: (picked.currencyCode as string) ?? '',
          amount: (picked.creditsRemaining as number) ?? 0,
        }
      : undefined,
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
