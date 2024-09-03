// @ts-nocheck
import { Suspense } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { Spinner } from '@blueprintjs/core';
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
        <Suspense fallback={<Spinner size={40} />}>
          <CategorizeTransactionForm />
        </Suspense>
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
