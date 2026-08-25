import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { FormattedMessage as T, AppToaster } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { withCustomersActions } from '@/containers/Customers/CustomersLanding/withCustomersActions';
import type { WithCustomersActionsProps } from '@/containers/Customers/CustomersLanding/withCustomersActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { useBulkDeleteCustomers } from '@/hooks/query/customers';
import { compose } from '@/utils';

interface CustomerBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface CustomerBulkDeleteDialogProps
  extends WithCustomersActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function CustomerBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withCustomersActions
  resetCustomersSelectedRows,

  // #withDialogActions
  closeDialog,
}: CustomerBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: CustomerBulkDeleteDialogPayload = payload;

  const { mutateAsync: bulkDeleteCustomers, isPending: isLoading } =
    useBulkDeleteCustomers();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteCustomers({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_customers_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetCustomersSelectedRows();
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
          values={{ resourcePlural: intl.get('resource_customer_plural') }}
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
        resourceSingularLabel={intl.get('resource_customer_singular')}
        resourcePluralLabel={intl.get('resource_customer_plural')}
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

export const CustomerBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withCustomersActions,
)(CustomerBulkDeleteDialogInner);
