// @ts-nocheck
import styled from 'styled-components';
import * as R from 'ramda';
import { CategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { CategorizeTransactionForm } from './CategorizeTransactionForm';
import { withBanking } from '@/containers/CashFlow/withBanking';

function CategorizeTransactionContentRoot({
  transactionsToCategorizeIdsSelected,
}) {
  return (
    <CategorizeTransactionBoot
      uncategorizedTransactionsIds={transactionsToCategorizeIdsSelected}
    >
      <CategorizeTransactionDrawerBody>
        <CategorizeTransactionForm />
      </CategorizeTransactionDrawerBody>
    </CategorizeTransactionBoot>
  );
}

export const CategorizeTransactionContent = R.compose(
  withBanking(({ transactionsToCategorizeIdsSelected }) => ({
    transactionsToCategorizeIdsSelected,
  })),
)(CategorizeTransactionContentRoot);

const CategorizeTransactionDrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;
