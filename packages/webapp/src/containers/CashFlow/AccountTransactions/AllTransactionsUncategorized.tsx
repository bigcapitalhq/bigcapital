// @ts-nocheck
import { useEffect, lazy } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import '@/style/pages/CashFlow/AccountTransactions/List.scss';

import { AccountTransactionsUncategorizeFilter } from './AccountTransactionsUncategorizeFilter';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../withBankingActions';
import { useAppQueryString } from '@/hooks';

const Box = styled.div`
  margin: 30px 15px;
`;

interface AllTransactionsUncategorizedProps extends WithBankingActionsProps {}

function AllTransactionsUncategorizedRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
}: AllTransactionsUncategorizedProps) {
  // Close the match aside once leaving the page.
  useEffect(
    () => () => {
      closeMatchingTransactionAside();
    },
    [closeMatchingTransactionAside],
  );

  return (
    <Box>
      <AccountTransactionsUncategorizeFilter />
      <AccountTransactionsSwitcher />
    </Box>
  );
}

const AccountExcludedTransactins = lazy(() =>
  import('./UncategorizedTransactions/AccountExcludedTransactions').then(
    (module) => ({ default: module.AccountExcludedTransactions }),
  ),
);
const AccountRecognizedTransactions = lazy(() =>
  import('./UncategorizedTransactions/AccountRecgonizedTranasctions').then(
    (module) => ({ default: module.AccountRecognizedTransactions }),
  ),
);
const AccountUncategorizedTransactions = lazy(() =>
  import(
    './UncategorizedTransactions/AccountUncategorizedTransactionsAll'
  ).then((module) => ({ default: module.AccountUncategorizedTransactionsAll })),
);

const PendingTransactions = lazy(() =>
  import('./PendingTransactions/PendingTransactions').then((module) => ({
    default: module.PendingTransactions,
  })),
);

/**
 * Switches between the account transactions tables.
 * @returns {React.ReactNode}
 */
function AccountTransactionsSwitcher() {
  const [locationQuery] = useAppQueryString();
  const uncategorizedTab = locationQuery?.uncategorizedFilter;

  switch (uncategorizedTab) {
    case 'excluded':
      return <AccountExcludedTransactins />;
    case 'recognized':
      return <AccountRecognizedTransactions />;
    case 'all':
    default:
      return <AccountUncategorizedTransactions />;
    case 'pending':
      return <PendingTransactions />;
  }
}

export default R.compose(withBankingActions)(AllTransactionsUncategorizedRoot);
