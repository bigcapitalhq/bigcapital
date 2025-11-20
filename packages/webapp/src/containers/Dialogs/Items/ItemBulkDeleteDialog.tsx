// @ts-nocheck
import React from 'react';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, AppToaster } from '@/components';
import intl from 'react-intl-universal';

import BulkDeleteDialogContent from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { useBulkDeleteItems } from '@/hooks/query/items';
import withDialogRedux from '@/components/DialogReduxConnect';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withItemsActions from '@/containers/Items/withItemsActions';
import { compose } from '@/utils';

function ItemBulkDeleteDialog({
  dialogName,
  isOpen,
  payload: {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  } = {},

  // #withItemsActions
  setItemsSelectedRows,

  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: bulkDeleteItems, isLoading } = useBulkDeleteItems();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteItems({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get('the_items_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        setItemsSelectedRows([]);
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
          values={{ resourcePlural: intl.get('resource_item_plural') }}
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
        resourceSingularLabel={intl.get('resource_item_singular')}
        resourcePluralLabel={intl.get('resource_item_plural')}
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
  withItemsActions,
)(ItemBulkDeleteDialog);

