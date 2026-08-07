import { first } from 'lodash';
import React, { useMemo } from 'react';
import type { GetAutofillCategorizeTransaction } from '@/hooks/query/banking';
import type { AccountsList, BranchesListResponse } from '@bigcapital/sdk-ts';
import { DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { useAccounts, useBranches } from '@/hooks/query';
import { useGetAutofillCategorizeTransaction } from '@/hooks/query/banking';
import { useFeatureCan } from '@/hooks/state';

interface CategorizeTransactionBootProps {
  uncategorizedTransactionsIds: Array<number>;
  children?: React.ReactNode;
}

interface PrimaryBranch {
  id: number;
  primary?: boolean;
}

interface CategorizeTransactionBootValue {
  branches: BranchesListResponse | undefined;
  accounts: AccountsList | undefined;
  isBranchesLoading: boolean;
  isAccountsLoading: boolean;
  primaryBranch: PrimaryBranch | undefined;
  autofillCategorizeValues: GetAutofillCategorizeTransaction | null | undefined;
  isAutofillCategorizeValuesLoading: boolean;
}

const CategorizeTransactionBootContext =
  React.createContext<CategorizeTransactionBootValue>(
    {} as CategorizeTransactionBootValue,
  );

/**
 * Categorize transcation boot.
 */
function CategorizeTransactionBoot({
  uncategorizedTransactionsIds,
  children,
}: CategorizeTransactionBootProps) {
  // Detarmines whether the feature is enabled.
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches the branches list.
  const { data: branches, isLoading: isBranchesLoading } = useBranches(
    {},
    { enabled: isBranchFeatureCan },
  );
  // Fetches the autofill values of categorize transaction.
  const {
    data: autofillCategorizeValues,
    isLoading: isAutofillCategorizeValuesLoading,
  } = useGetAutofillCategorizeTransaction(uncategorizedTransactionsIds);

  // Retrieves the primary branch.
  const primaryBranch = useMemo(() => {
    const list = (branches ?? []) as Array<PrimaryBranch>;
    return list.find((b) => b.primary) || first(list);
  }, [branches]);

  const provider: CategorizeTransactionBootValue = {
    branches: branches as BranchesListResponse | undefined,
    accounts,
    isBranchesLoading,
    isAccountsLoading,
    primaryBranch,
    autofillCategorizeValues,
    isAutofillCategorizeValuesLoading,
  };
  const isLoading =
    isBranchesLoading || isAccountsLoading || isAutofillCategorizeValuesLoading;

  return (
    <DrawerLoading loading={isLoading}>
      <CategorizeTransactionBootContext.Provider value={provider}>
        {children}
      </CategorizeTransactionBootContext.Provider>
    </DrawerLoading>
  );
}

const useCategorizeTransactionBoot = () =>
  React.useContext(CategorizeTransactionBootContext);

export { CategorizeTransactionBoot, useCategorizeTransactionBoot };
