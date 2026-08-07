import { Spinner } from '@blueprintjs/core';
import { Suspense } from 'react';
import styled from 'styled-components';
import { CategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { CategorizeTransactionForm } from './CategorizeTransactionForm';
import type { WithBankingProps } from '@/containers/CashFlow/withBanking';
import { withBanking } from '@/containers/CashFlow/withBanking';
import { compose } from '@/utils';

interface CategorizeTransactionContentRootProps
  extends Pick<WithBankingProps, 'transactionsToCategorizeIdsSelected'> {}

function CategorizeTransactionContentRoot({
  transactionsToCategorizeIdsSelected,
}: CategorizeTransactionContentRootProps) {
  return (
    <CategorizeTransactionBoot
      uncategorizedTransactionsIds={transactionsToCategorizeIdsSelected.filter(
        (id): id is number => typeof id === 'number',
      )}
    >
      <CategorizeTransactionDrawerBody>
        <Suspense fallback={<Spinner size={40} />}>
          <CategorizeTransactionForm />
        </Suspense>
      </CategorizeTransactionDrawerBody>
    </CategorizeTransactionBoot>
  );
}

export const CategorizeTransactionContent = compose(
  withBanking(({ transactionsToCategorizeIdsSelected }) => ({
    transactionsToCategorizeIdsSelected,
  })),
)(CategorizeTransactionContentRoot);

const CategorizeTransactionDrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;
