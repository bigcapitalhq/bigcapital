import * as R from 'ramda';
import { useEffect } from 'react';
import AccountTransactionsUncategorizedTable from './AccountTransactionsUncategorizedTable';
import { AccountUncategorizedTransactionsBoot } from '../AllTransactionsUncategorizedBoot';
import { AccountTransactionsCard } from './AccountTransactionsCard';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../../withBankingActions';

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

export const AccountUncategorizedTransactionsAll = R.compose(
  withBankingActions,
)(AccountUncategorizedTransactionsAllRoot);
