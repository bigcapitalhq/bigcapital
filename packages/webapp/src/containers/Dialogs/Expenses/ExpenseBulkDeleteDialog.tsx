import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithExpensesActionsProps } from '@/containers/Expenses/ExpensesLanding/withExpensesActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withExpensesActions } from '@/containers/Expenses/ExpensesLanding/withExpensesActions';
import { useBulkDeleteExpenses } from '@/hooks/query/expenses';
import { compose } from '@/utils';

interface ExpenseBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface ExpenseBulkDeleteDialogProps
  extends WithExpensesActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function ExpenseBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withExpensesActions
  resetExpensesSelectedRows,

  // #withDialogActions
  closeDialog,
}: ExpenseBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: ExpenseBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteExpenses, isPending: isLoading } =
    useBulkDeleteExpenses();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteExpenses({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_expenses_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetExpensesSelectedRows();
        closeDialog(dialogName);
      })
      .catch(() => {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <Dialog
      title={
        <T
          id={'bulk_delete_dialog_title'}
          values={{ resourcePlural: intl.get('resource_expense_plural') }}
        />
      }
      isOpen={isOpen}
      onClose={handleCancel}
      canEscapeKeyClose={!isLoading}
      canOutsideClickClose={!isLoading}
    >
      <BulkDeleteDialogContent
        totalSelected={totalSelected}
        deletableCount={deletableCount}
        undeletableCount={undeletableCount}
        resourceSingularLabel={intl.get('resource_expense_singular')}
        resourcePluralLabel={intl.get('resource_expense_plural')}
      />

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancel} disabled={isLoading}>
            <T id={'cancel'} />
          </Button>

          <Button
            intent={Intent.DANGER}
            onClick={handleConfirmBulkDelete}
            loading={isLoading}
            disabled={deletableCount === 0 || isLoading}
          >
            <T id={'delete_count'} values={{ count: deletableCount }} />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export const ExpenseBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withExpensesActions,
)(ExpenseBulkDeleteDialogInner);
