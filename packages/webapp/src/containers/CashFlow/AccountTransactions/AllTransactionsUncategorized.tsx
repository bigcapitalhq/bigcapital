import { useEffect, lazy } from 'react';
import styled from 'styled-components';

import '@/style/pages/CashFlow/AccountTransactions/List.scss';
import { withBankingActions } from '../withBankingActions';
import { AccountTransactionsUncategorizeFilter } from './AccountTransactionsUncategorizeFilter';
import type { WithBankingActionsProps } from '../withBankingActions';
import type { ComponentType } from 'react';
import { useAppQueryString } from '@/hooks';
import { compose } from '@/utils';

const Box = styled.div`
  margin: 30px 15px;
`;

interface AllTransactionsUncategorizedProps
  extends Pick<WithBankingActionsProps, 'closeMatchingTransactionAside'> {}

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

const AccountExcludedTransactins = lazy(
  () =>
    import('./UncategorizedTransactions/AccountExcludedTransactions').then(
      (module) => ({ default: module.AccountExcludedTransactions }),
    ) as Promise<{ default: ComponentType }>,
);
const AccountRecognizedTransactions = lazy(
  () =>
    import('./UncategorizedTransactions/AccountRecgonizedTranasctions').then(
      (module) => ({ default: module.AccountRecognizedTransactions }),
    ) as Promise<{ default: ComponentType }>,
);
const AccountUncategorizedTransactions = lazy(
  () =>
    import(
      './UncategorizedTransactions/AccountUncategorizedTransactionsAll'
    ).then((module) => ({
      default: module.AccountUncategorizedTransactionsAll,
    })) as Promise<{ default: ComponentType }>,
);
const PendingTransactions = lazy(
  () =>
    import('./PendingTransactions/PendingTransactions').then((module) => ({
      default: module.PendingTransactions,
    })) as Promise<{ default: ComponentType }>,
);

/**
 * Switches between the account transactions tables.
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

export const AllTransactionsUncategorized = compose(withBankingActions)(
  AllTransactionsUncategorizedRoot,
);
