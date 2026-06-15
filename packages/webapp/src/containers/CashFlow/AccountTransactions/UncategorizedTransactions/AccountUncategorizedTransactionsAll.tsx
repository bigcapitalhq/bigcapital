import * as R from 'ramda';
import { useEffect } from 'react';
import { AccountTransactionsUncategorizedTable } from './AccountTransactionsUncategorizedTable';
import { AccountUncategorizedTransactionsBoot } from '../AllTransactionsUncategorizedBoot';
import { AccountTransactionsCard } from './AccountTransactionsCard';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../../withBankingActions';
import { flow } from 'fp-ts/function';

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

export const AccountUncategorizedTransactionsAll = flow(
  withBankingActions,
)(AccountUncategorizedTransactionsAllRoot);
