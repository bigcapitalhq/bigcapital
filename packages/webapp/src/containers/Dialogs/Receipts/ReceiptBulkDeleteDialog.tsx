import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithReceiptsActionsProps } from '@/containers/Sales/Receipts/ReceiptsLanding/withReceiptsActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withReceiptsActions } from '@/containers/Sales/Receipts/ReceiptsLanding/withReceiptsActions';
import { useBulkDeleteReceipts } from '@/hooks/query/receipts';
import { compose } from '@/utils';

interface ReceiptBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface ReceiptBulkDeleteDialogProps
  extends WithReceiptsActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function ReceiptBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withReceiptsActions
  resetReceiptsSelectedRows,

  // #withDialogActions
  closeDialog,
}: ReceiptBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: ReceiptBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteReceipts, isPending: isLoading } =
    useBulkDeleteReceipts();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteReceipts({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_receipts_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetReceiptsSelectedRows();
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
          values={{ resourcePlural: intl.get('resource_receipt_plural') }}
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
        resourceSingularLabel={intl.get('resource_receipt_singular')}
        resourcePluralLabel={intl.get('resource_receipt_plural')}
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

export const ReceiptBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withReceiptsActions,
)(ReceiptBulkDeleteDialogInner);
