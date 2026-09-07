import * as FF from 'fp-ts/function';
import { useEffect } from 'react';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../../withBankingActions';
import { AccountUncategorizedTransactionsBoot } from '../AllTransactionsUncategorizedBoot';
import { AccountTransactionsCard } from './AccountTransactionsCard';
import { AccountTransactionsUncategorizedTable } from './AccountTransactionsUncategorizedTable';

interface AccountUncategorizedTransactionsAllRootProps
  extends WithBankingActionsProps {}

function AccountUncategorizedTransactionsAllRoot({
  resetUncategorizedTransactionsSelected,
}: AccountUncategorizedTransactionsAllRootProps) {
  useEffect(
    () => () => {
      resetUncategorizedTransactionsSelected();
    },
    [resetUncategorizedTransactionsSelected],
  );

  return (
    <AccountUncategorizedTransactionsBoot>
      <AccountTransactionsCard>
        <AccountTransactionsUncategorizedTable />
      </AccountTransactionsCard>
    </AccountUncategorizedTransactionsBoot>
  );
}

export const AccountUncategorizedTransactionsAll = FF.pipe(
  AccountUncategorizedTransactionsAllRoot,
  withBankingActions,
);
