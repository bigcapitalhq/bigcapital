import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithWarehouseTransfersActionsProps } from '@/containers/WarehouseTransfers/WarehouseTransfersLanding/withWarehouseTransfersActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withWarehouseTransfersActions } from '@/containers/WarehouseTransfers/WarehouseTransfersLanding/withWarehouseTransfersActions';
import { useBulkDeleteWarehouseTransfers } from '@/hooks/query';

interface WarehouseTransferBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface WarehouseTransferBulkDeleteDialogProps
  extends WithWarehouseTransfersActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

/**
 * Warehouse transfer bulk delete dialog.
 */
function WarehouseTransferBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withWarehouseTransfersActions
  resetWarehouseTransferSelectedRows,

  // #withDialogActions
  closeDialog,
}: WarehouseTransferBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: WarehouseTransferBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteWarehouseTransfers, isPending: isLoading } =
    useBulkDeleteWarehouseTransfers();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteWarehouseTransfers({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'the_warehouse_transfers_has_been_deleted_successfully',
          ),
          intent: Intent.SUCCESS,
        });
        resetWarehouseTransferSelectedRows();
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
          values={{
            resourcePlural: intl.get('resource_warehouse_transfer_plural'),
          }}
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
        resourceSingularLabel={intl.get('resource_warehouse_transfer_singular')}
        resourcePluralLabel={intl.get('resource_warehouse_transfer_plural')}
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

export const WarehouseTransferBulkDeleteDialog = FF.pipe(
  WarehouseTransferBulkDeleteDialogInner,
  withWarehouseTransfersActions,
  withDialogActions,
  withDialogRedux(),
);
