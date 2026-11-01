import * as FF from 'fp-ts/function';
import { useEffect } from 'react';
import { withBankingActions } from '../../withBankingActions';
import { ExcludedTransactionsTable } from '../ExcludedTransactions/ExcludedTransactionsTable';
import { ExcludedBankTransactionsTableBoot } from '../ExcludedTransactions/ExcludedTransactionsTableBoot';
import { AccountTransactionsCard } from './AccountTransactionsCard';
import type { WithBankingActionsProps } from '../../withBankingActions';

interface AccountExcludedTransactionsProps
  extends Pick<WithBankingActionsProps, 'resetExcludedTransactionsSelected'> {}

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

export const AccountExcludedTransactions = FF.pipe(
  AccountExcludedTransactionsRoot,
  withBankingActions,
);
