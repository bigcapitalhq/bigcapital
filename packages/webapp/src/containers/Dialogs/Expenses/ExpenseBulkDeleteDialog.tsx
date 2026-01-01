// @ts-nocheck
import React from 'react';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, AppToaster } from '@/components';
import intl from 'react-intl-universal';

import BulkDeleteDialogContent from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { useBulkDeleteExpenses } from '@/hooks/query/expenses';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withExpensesActions } from '@/containers/Expenses/ExpensesLanding/withExpensesActions';
import { compose } from '@/utils';

function ExpenseBulkDeleteDialog({
  dialogName,
  isOpen,
  payload: {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  } = {},

  // #withExpensesActions
  setExpensesSelectedRows,

  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: bulkDeleteExpenses, isLoading } =
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
        setExpensesSelectedRows([]);
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

export default compose(
  withDialogRedux(),
  withDialogActions,
  withExpensesActions,
)(ExpenseBulkDeleteDialog);

