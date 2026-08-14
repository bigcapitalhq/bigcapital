import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithItemsActionsProps } from '@/containers/Items/withItemsActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withItemsActions } from '@/containers/Items/withItemsActions';
import { useBulkDeleteItems } from '@/hooks/query/items';
import { compose } from '@/utils';

interface ItemBulkDeleteDialogProps
  extends WithDialogActionsProps,
    WithItemsActionsProps {
  dialogName: string;
  isOpen: boolean;
  payload: {
    ids?: number[];
    deletableCount?: number;
    undeletableCount?: number;
    totalSelected?: number;
  };
}

function ItemBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload: {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  } = {},
  resetItemsSelectedRows,
  closeDialog,
}: ItemBulkDeleteDialogProps): React.ReactElement {
  const { mutateAsync: bulkDeleteItems, isPending } = useBulkDeleteItems();

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
        resetItemsSelectedRows();
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
      canEscapeKeyClose={!isPending}
      canOutsideClickClose={!isPending}
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
          <Button onClick={handleCancel} disabled={isPending}>
            <T id={'cancel'} />
          </Button>

          <Button
            intent={Intent.DANGER}
            onClick={handleConfirmBulkDelete}
            loading={isPending}
            disabled={deletableCount === 0 || isPending}
          >
            <T id={'delete_count'} values={{ count: deletableCount }} />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export const ItemBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withItemsActions,
)(ItemBulkDeleteDialogInner);
