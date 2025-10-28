// @ts-nocheck
import { useEffect } from 'react';
import * as R from 'ramda';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../../withBankingActions';
import { ExcludedTransactionsTable } from '../ExcludedTransactions/ExcludedTransactionsTable';
import { ExcludedBankTransactionsTableBoot } from '../ExcludedTransactions/ExcludedTransactionsTableBoot';
import { AccountTransactionsCard } from './AccountTransactionsCard';

interface AccountExcludedTransactionsProps extends WithBankingActionsProps {}

function AccountExcludedTransactionsRoot({
  // #withBankingActions
  resetExcludedTransactionsSelected,
}: AccountExcludedTransactionsProps) {
  useEffect(
    () => () => {
      resetExcludedTransactionsSelected();
    },
    [resetExcludedTransactionsSelected],
  );

  return (
    <ExcludedBankTransactionsTableBoot>
      <AccountTransactionsCard>
        <ExcludedTransactionsTable />
      </AccountTransactionsCard>
    </ExcludedBankTransactionsTableBoot>
  );
}

export const AccountExcludedTransactions = R.compose(withBankingActions)(
  AccountExcludedTransactionsRoot,
);
