// @ts-nocheck
import * as R from 'ramda';
import { Aside } from '@/components/Aside/Aside';
import { CategorizeTransactionTabs } from './CategorizeTransactionTabs';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../withBankingActions';
import { CategorizeTransactionTabsBoot } from './CategorizeTransactionTabsBoot';
import { withBanking } from '../withBanking';
import { useEffect } from 'react';

interface CategorizeTransactionAsideProps extends WithBankingActionsProps {}

function CategorizeTransactionAsideRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
  closeReconcileMatchingTransaction,

  // #withBanking
  selectedUncategorizedTransactionId,
}: CategorizeTransactionAsideProps) {
  // 
  useEffect(
    () => () => {
      closeReconcileMatchingTransaction();
    },
    [closeReconcileMatchingTransaction],
  );

  const handleClose = () => {
    closeMatchingTransactionAside();
  };
  const uncategorizedTransactionId = selectedUncategorizedTransactionId;

  if (!selectedUncategorizedTransactionId) {
    return null;
  }
  return (
    <Aside title={'Categorize Bank Transaction'} onClose={handleClose}>
      <Aside.Body>
        <CategorizeTransactionTabsBoot
          uncategorizedTransactionId={uncategorizedTransactionId}
        >
          <CategorizeTransactionTabs />
        </CategorizeTransactionTabsBoot>
      </Aside.Body>
    </Aside>
  );
}

export const CategorizeTransactionAside = R.compose(
  withBankingActions,
  withBanking(({ selectedUncategorizedTransactionId }) => ({
    selectedUncategorizedTransactionId,
  })),
)(CategorizeTransactionAsideRoot);
