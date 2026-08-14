import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { withBanking } from '../withBanking';
import { withBankingActions } from '../withBankingActions';
import { CategorizeTransactionTabs } from './CategorizeTransactionTabs';
import { CategorizeTransactionTabsBoot } from './CategorizeTransactionTabsBoot';
import type { WithBankingProps } from '../withBanking';
import type { WithBankingActionsProps } from '../withBankingActions';
import { Aside } from '@/components/Aside/Aside';
import { compose } from '@/utils';

interface CategorizeTransactionAsideProps
  extends Pick<
      WithBankingActionsProps,
      | 'closeMatchingTransactionAside'
      | 'closeReconcileMatchingTransaction'
      | 'resetTransactionsToCategorizeSelected'
      | 'enableMultipleCategorization'
    >,
    Pick<WithBankingProps, 'transactionsToCategorizeIdsSelected'> {}

function CategorizeTransactionAsideRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
  closeReconcileMatchingTransaction,
  resetTransactionsToCategorizeSelected,
  enableMultipleCategorization,

  // #withBanking
  transactionsToCategorizeIdsSelected,
}: CategorizeTransactionAsideProps) {
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
  };
  // Cannot continue if there is no selected transaction.
  if (isEmpty(transactionsToCategorizeIdsSelected)) {
    return null;
  }
  return (
    <Aside title={'Categorize Bank Transaction'} onClose={handleClose}>
      <Aside.Body>
        <CategorizeTransactionTabsBoot
          uncategorizedTransactionIds={transactionsToCategorizeIdsSelected.filter(
            (id): id is number => typeof id === 'number',
          )}
        >
          <CategorizeTransactionTabs />
        </CategorizeTransactionTabsBoot>
      </Aside.Body>
    </Aside>
  );
}

export const CategorizeTransactionAside = compose(
  withBankingActions,
  withBanking(({ transactionsToCategorizeIdsSelected }) => ({
    transactionsToCategorizeIdsSelected,
  })),
)(CategorizeTransactionAsideRoot);
