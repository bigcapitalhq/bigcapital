import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithVendorsCreditNotesActionsProps } from '@/containers/Purchases/CreditNotes/CreditNotesLanding/withVendorsCreditNotesActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withVendorsCreditNotesActions } from '@/containers/Purchases/CreditNotes/CreditNotesLanding/withVendorsCreditNotesActions';
import { useBulkDeleteVendorCredits } from '@/hooks/query/vendor-credit';
import { compose } from '@/utils';

interface VendorCreditBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface VendorCreditBulkDeleteDialogProps
  extends WithVendorsCreditNotesActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function VendorCreditBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withVendorsCreditNotesActions
  resetVendorsCreditNoteSelectedRows,

  // #withDialogActions
  closeDialog,
}: VendorCreditBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: VendorCreditBulkDeleteDialogPayload = payload ?? {};

  const { mutateAsync: bulkDeleteVendorCredits, isPending: isLoading } =
    useBulkDeleteVendorCredits();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteVendorCredits({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_vendor_credits_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetVendorsCreditNoteSelectedRows();
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
          values={{ resourcePlural: intl.get('resource_vendor_credit_plural') }}
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
        resourceSingularLabel={intl.get('resource_vendor_credit_singular')}
        resourcePluralLabel={intl.get('resource_vendor_credit_plural')}
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

export const VendorCreditBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withVendorsCreditNotesActions,
)(VendorCreditBulkDeleteDialogInner);
