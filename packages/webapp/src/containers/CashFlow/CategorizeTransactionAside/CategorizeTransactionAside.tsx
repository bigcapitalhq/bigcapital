import * as R from 'ramda';
import { Aside } from '@/components/Aside/Aside';
import { CategorizeTransactionTabs } from './CategorizeTransactionTabs';
import {
  WithBankingActionsProps,
  withBankingActions,
} from '../withBankingActions';

interface CategorizeTransactionAsideProps extends WithBankingActionsProps {}

function CategorizeTransactionAsideRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
}: CategorizeTransactionAsideProps) {
  const handleClose = () => {
    closeMatchingTransactionAside();
  };

  return (
    <Aside title={'Categorize Bank Transaction'} onClose={handleClose}>
      <CategorizeTransactionTabs />
    </Aside>
  );
}

export const CategorizeTransactionAside = R.compose(withBankingActions)(
  CategorizeTransactionAsideRoot,
);
