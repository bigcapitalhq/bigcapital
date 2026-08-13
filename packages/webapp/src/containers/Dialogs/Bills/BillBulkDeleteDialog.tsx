import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithBillsActionsProps } from '@/containers/Purchases/Bills/BillsLanding/withBillsActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withBillsActions } from '@/containers/Purchases/Bills/BillsLanding/withBillsActions';
import { useBulkDeleteBills } from '@/hooks/query/bills';
import { compose } from '@/utils';

interface BillBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface BillBulkDeleteDialogProps
  extends WithBillsActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

/**
 * Bill bulk delete dialog.
 */
function BillBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withBillsActions
  resetBillsSelectedRows,

  // #withDialogActions
  closeDialog,
}: BillBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: BillBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteBills, isPending: isLoading } =
    useBulkDeleteBills();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteBills({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_bills_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetBillsSelectedRows();
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
          values={{ resourcePlural: intl.get('resource_bill_plural') }}
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
        resourceSingularLabel={intl.get('resource_bill_singular')}
        resourcePluralLabel={intl.get('resource_bill_plural')}
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

export const BillBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withBillsActions,
)(BillBulkDeleteDialogInner);
