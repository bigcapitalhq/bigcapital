import { useEffect } from 'react';
import styled from 'styled-components';
import '@/style/pages/CashFlow/AccountTransactions/List.scss';
import { withBankingActions } from '../withBankingActions';
import { AccountTransactionsAllProvider } from './AccountTransactionsAllBoot';
import { AccountTransactionsDataTable } from './AccountTransactionsDataTable';
import type { WithBankingActionsProps } from '../withBankingActions';
import { compose } from '@/utils';

const Box = styled.div`
  margin: 30px 15px;
`;

const CashflowTransactionsTableCard = styled.div`
  background: var(--color-bank-transactions-content-background);
  border: 2px solid var(--color-bank-transactions-content-border);
  border-radius: 10px;
  padding: 30px 18px;
  flex: 0 1;
`;

interface AccountTransactionsAllProps
  extends Pick<
    WithBankingActionsProps,
    'resetCategorizedTransactionsSelected'
  > {}

function AccountTransactionsAllRoot({
  resetCategorizedTransactionsSelected,
}: AccountTransactionsAllProps) {
  useEffect(
    () => () => {
      resetCategorizedTransactionsSelected();
    },
    [resetCategorizedTransactionsSelected],
  );

  return (
    <AccountTransactionsAllProvider>
      <Box>
        <CashflowTransactionsTableCard>
          <AccountTransactionsDataTable />
        </CashflowTransactionsTableCard>
      </Box>
    </AccountTransactionsAllProvider>
  );
}

export const AccountTransactionsAll = compose(withBankingActions)(
  AccountTransactionsAllRoot,
);
