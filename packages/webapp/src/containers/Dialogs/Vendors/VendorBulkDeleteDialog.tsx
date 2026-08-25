import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { FormattedMessage as T, AppToaster } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withVendorsActions } from '@/containers/Vendors/VendorsLanding/withVendorsActions';
import type { WithVendorsActionsProps } from '@/containers/Vendors/VendorsLanding/withVendorsActions';
import { useBulkDeleteVendors } from '@/hooks/query/vendors';
import { compose } from '@/utils';

interface VendorBulkDeleteDialogPayload {
  ids?: number[];
  deletableCount?: number;
  undeletableCount?: number;
  totalSelected?: number;
}

interface VendorBulkDeleteDialogProps
  extends WithVendorsActionsProps,
    WithDialogActionsProps,
    DialogBaseProps {
  dialogName: string;
}

function VendorBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload,

  // #withVendorsActions
  resetVendorsSelectedRows,

  // #withDialogActions
  closeDialog,
}: VendorBulkDeleteDialogProps) {
  const {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  }: VendorBulkDeleteDialogPayload = payload;

  const { mutateAsync: bulkDeleteVendors, isPending: isLoading } =
    useBulkDeleteVendors();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteVendors({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_vendors_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        resetVendorsSelectedRows();
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
          values={{ resourcePlural: intl.get('resource_vendor_plural') }}
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
        resourceSingularLabel={intl.get('resource_vendor_singular')}
        resourcePluralLabel={intl.get('resource_vendor_plural')}
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

export const VendorBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withVendorsActions,
)(VendorBulkDeleteDialogInner);
