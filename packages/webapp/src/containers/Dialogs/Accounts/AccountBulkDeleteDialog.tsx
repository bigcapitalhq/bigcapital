import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithAccountsTableActionsProps } from '@/containers/Accounts/withAccountsTableActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { handleDeleteErrors } from '@/containers/Accounts/utils';
import { withAccountsTableActions } from '@/containers/Accounts/withAccountsTableActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { useBulkDeleteAccounts } from '@/hooks/query/accounts';
import { compose } from '@/utils';

interface AccountBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface AccountBulkDeleteDialogProps
  extends WithAccountsTableActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function AccountBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withAccountsTableActions
  resetAccountsSelectedRows,

  // #withDialogActions
  closeDialog,
}: AccountBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: AccountBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteAccounts, isPending: isLoading } =
    useBulkDeleteAccounts();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteAccounts({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_accounts_has_been_successfully_deleted'),
          intent: Intent.SUCCESS,
        });
        resetAccountsSelectedRows();
        closeDialog(dialogName);
      })
      .catch((errors: unknown) => {
        // Account dialog uses the shared `handleDeleteErrors` helper for
        // richer error rendering (vs the generic toast used by other dialogs).
        handleDeleteErrors(errors as never);
      });
  };

  return (
    <Dialog
      title={
        <T
          id={'bulk_delete_dialog_title'}
          values={{ resourcePlural: intl.get('resource_account_plural') }}
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
        resourceSingularLabel={intl.get('resource_account_singular')}
        resourcePluralLabel={intl.get('resource_account_plural')}
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

export const AccountBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withAccountsTableActions,
)(AccountBulkDeleteDialogInner);
