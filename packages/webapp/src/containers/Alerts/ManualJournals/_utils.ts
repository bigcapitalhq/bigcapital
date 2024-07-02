import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';

export const handleDeleteErrors = (errors: any) => {
  if (errors.find((e: any) => e.type === 'CANNOT_DELETE_TRANSACTION_MATCHED')) {
    AppToaster.show({
      intent: Intent.DANGER,
      message: 'Cannot delete a transaction matched with a bank transaction.',
    });
  }
};
