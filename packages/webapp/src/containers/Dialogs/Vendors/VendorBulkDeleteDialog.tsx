// @ts-nocheck
import React from 'react';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, AppToaster } from '@/components';
import intl from 'react-intl-universal';

import BulkDeleteDialogContent from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { useBulkDeleteVendors } from '@/hooks/query/vendors';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withVendorsActions } from '@/containers/Vendors/VendorsLanding/withVendorsActions';
import { compose } from '@/utils';

function VendorBulkDeleteDialog({
  dialogName,
  isOpen,
  payload: {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  } = {},

  // #withVendorsActions
  setVendorsSelectedRows,

  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: bulkDeleteVendors, isLoading } = useBulkDeleteVendors();

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
        setVendorsSelectedRows([]);
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

export default compose(
  withDialogRedux(),
  withDialogActions,
  withVendorsActions,
)(VendorBulkDeleteDialog);

