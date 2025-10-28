import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

export const handleDeleteErrors = (errors: any) => {
  if (errors.find((e: any) => e.type === 'EXPENSE_HAS_ASSOCIATED_LANDED_COST')) {
    AppToaster.show({
      intent: Intent.DANGER,
      message: intl.get(
        'couldn_t_delete_expense_transaction_has_associated_located_landed_cost_transaction',
      ),
    });
  }
  if (errors.find((e: any) => e.type === 'CANNOT_DELETE_TRANSACTION_MATCHED')) {
    AppToaster.show({
      intent: Intent.DANGER,
      message: 'Cannot delete a transaction matched with a bank transaction.',
    });
  }
};
