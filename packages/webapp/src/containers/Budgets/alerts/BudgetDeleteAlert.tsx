import { Intent, Alert } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withAlertStoreConnect,
  WithAlertStoreConnectProps,
} from '@/containers/Alert/withAlertStoreConnect';
import { useDeleteBudget } from '@/hooks/query';

interface BudgetDeleteAlertInnerProps
  extends Pick<WithAlertStoreConnectProps, 'isOpen'>,
    Pick<WithAlertActionsProps, 'closeAlert'> {
  name: string;
  payload: { budgetId: number };
}

/**
 * Budget delete alert.
 */
function BudgetDeleteAlertInner({
  name,
  isOpen,
  payload: { budgetId },
  closeAlert,
}: BudgetDeleteAlertInnerProps) {
  const { mutateAsync: deleteBudget, isPending } = useDeleteBudget();

  // Handle cancel delete budget alert.
  const handleCancelBudgetDelete = () => {
    closeAlert(name);
  };
  // Handle confirm delete budget.
  const handleConfirmDeleteBudget = () => {
    deleteBudget(budgetId)
      .then(() => {
        AppToaster.show({
          message: intl.get('budget.deleted_success'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: intl.get('budget.deleted_error'),
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelBudgetDelete}
      onConfirm={handleConfirmDeleteBudget}
      loading={isPending}
    >
      <p>{intl.get('budget.delete_confirm')}</p>

      <p>{intl.get('budget.delete_confirm_question')}</p>
    </Alert>
  );
}

export const BudgetDeleteAlert = FF.pipe(
  BudgetDeleteAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
