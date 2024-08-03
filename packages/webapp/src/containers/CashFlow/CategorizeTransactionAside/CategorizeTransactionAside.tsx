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
  resetTransactionsToCategorizeSelected,
  enableMultipleCategorization,
}: CategorizeTransactionAsideProps) {
  //
  useEffect(
    () => () => {
      // Close the reconcile matching form.
      closeReconcileMatchingTransaction();

      // Reset the selected transactions to categorize.
      resetTransactionsToCategorizeSelected();

      // Disable multi matching.
      enableMultipleCategorization(false);
    },
    [
      closeReconcileMatchingTransaction,
      resetTransactionsToCategorizeSelected,
      enableMultipleCategorization,
    ],
  );

  const handleClose = () => {
    closeMatchingTransactionAside();
  }
  // Cannot continue if there is no selected transactions.;
  if (!selectedUncategorizedTransactionId) {
    return null;
  }
  return (
    <Aside title={'Categorize Bank Transaction'} onClose={handleClose}>
      <Aside.Body>
        <CategorizeTransactionTabsBoot
          uncategorizedTransactionId={selectedUncategorizedTransactionId}
        >
          <CategorizeTransactionTabs />
        </CategorizeTransactionTabsBoot>
      </Aside.Body>
    </Aside>
  );
}

export const CategorizeTransactionAside = R.compose(
  withBankingActions,
  withBanking(({ transactionsToCategorizeIdsSelected }) => ({
    selectedUncategorizedTransactionId: transactionsToCategorizeIdsSelected,
  })),
)(CategorizeTransactionAsideRoot);
