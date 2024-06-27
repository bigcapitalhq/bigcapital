// @ts-nocheck
import { useEffect } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import '@/style/pages/CashFlow/AccountTransactions/List.scss';

import { AccountTransactionsUncategorizeFilter } from './AccountTransactionsUncategorizeFilter';
import { UncategorizedTransactionsFilterProvider } from './AccountUncategorizedTransactionsFilterProvider';
import { RecognizedTransactionsTableBoot } from './RecognizedTransactions/RecognizedTransactionsTableBoot';
import { RecognizedTransactionsTable } from './RecognizedTransactions/RecognizedTransactionsTable';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../withBankingActions';
import { AccountUncategorizedTransactionsBoot } from './AllTransactionsUncategorizedBoot';
import AccountTransactionsUncategorizedTable from './AccountTransactionsUncategorizedTable';
import { ExcludedBankTransactionsTableBoot } from './ExcludedTransactions/ExcludedTransactionsTableBoot';
import { ExcludedTransactionsTable } from './ExcludedTransactions/ExcludedTransactionsTable';

const Box = styled.div`
  margin: 30px 15px;
`;

const CashflowTransactionsTableCard = styled.div`
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  padding: 30px 18px;
  background: #fff;
  flex: 0 1;
`;

interface AllTransactionsUncategorizedProps extends WithBankingActionsProps {}

function AllTransactionsUncategorizedRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
}: AllTransactionsUncategorizedProps) {
  useEffect(
    () => () => {
      closeMatchingTransactionAside();
    },
    [closeMatchingTransactionAside],
  );

  return (
    <UncategorizedTransactionsFilterProvider>
      <Box>
        <AccountTransactionsUncategorizeFilter />

        <ExcludedBankTransactionsTableBoot>
          <CashflowTransactionsTableCard>
            <ExcludedTransactionsTable />
          </CashflowTransactionsTableCard>
        </ExcludedBankTransactionsTableBoot>

        {/* <RecognizedTransactionsTableBoot>
          <CashflowTransactionsTableCard>
            <RecognizedTransactionsTable />
          </CashflowTransactionsTableCard>
        </RecognizedTransactionsTableBoot> */}

        {/* <AccountUncategorizedTransactionsBoot>
          <CashflowTransactionsTableCard>
            <AccountTransactionsUncategorizedTable />
          </CashflowTransactionsTableCard>
        </AccountUncategorizedTransactionsBoot> */}
      </Box>
    </UncategorizedTransactionsFilterProvider>
  );
}

export default R.compose(withBankingActions)(AllTransactionsUncategorizedRoot);
