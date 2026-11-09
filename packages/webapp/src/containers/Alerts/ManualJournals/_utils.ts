import { Intent } from '@blueprintjs/core';
import { AppToaster } from '@/components';

interface DeleteError {
  type: string;
}

export const handleDeleteErrors = (errors: DeleteError[]): void => {
  if (errors.find((e) => e.type === 'CANNOT_DELETE_TRANSACTION_MATCHED')) {
    AppToaster.show({
      intent: Intent.DANGER,
      message: 'Cannot delete a transaction matched with a bank transaction.',
    });
  }
};
