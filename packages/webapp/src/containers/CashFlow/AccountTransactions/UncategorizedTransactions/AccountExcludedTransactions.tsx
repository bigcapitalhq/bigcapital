import { useEffect } from 'react';
import { withBankingActions } from '../../withBankingActions';
import { ExcludedTransactionsTable } from '../ExcludedTransactions/ExcludedTransactionsTable';
import { ExcludedBankTransactionsTableBoot } from '../ExcludedTransactions/ExcludedTransactionsTableBoot';
import { AccountTransactionsCard } from './AccountTransactionsCard';
import type { WithBankingActionsProps } from '../../withBankingActions';
import { compose } from '@/utils';

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

export const AccountExcludedTransactions = compose(withBankingActions)(
  AccountExcludedTransactionsRoot,
);
