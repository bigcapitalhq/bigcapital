import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithItemCategoriesActionsProps } from '@/containers/ItemsCategories/withItemCategoriesActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { BulkDeleteDialogContent } from '@/containers/Dialogs/components/BulkDeleteDialogContent';
import { withItemCategoriesActions } from '@/containers/ItemsCategories/withItemCategoriesActions';
import { useBulkDeleteItemCategories } from '@/hooks/query/items-categories';
import { compose } from '@/utils';

interface ItemCategoryBulkDeleteDialogProps
  extends WithDialogActionsProps,
    WithItemCategoriesActionsProps {
  dialogName: string;
  isOpen: boolean;
  payload: {
    ids?: number[];
    deletableCount?: number;
    undeletableCount?: number;
    totalSelected?: number;
  };
}

function ItemCategoryBulkDeleteDialogInner({
  dialogName,
  isOpen,
  payload: {
    ids = [],
    deletableCount = 0,
    undeletableCount = 0,
    totalSelected = ids.length,
  } = {},
  resetItemsCategoriesSelectedRows,
  closeDialog,
}: ItemCategoryBulkDeleteDialogProps): React.ReactElement {
  const { mutateAsync: bulkDeleteItemCategories, isPending } =
    useBulkDeleteItemCategories();

  const handleCancel = () => {
    closeDialog(dialogName);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteItemCategories({
      ids,
      skipUndeletable: true,
    })
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'the_item_categories_has_been_deleted_successfully',
          ),
          intent: Intent.SUCCESS,
        });
        resetItemsCategoriesSelectedRows();
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
            resourcePlural: intl.get('resource_item_category_plural'),
          }}
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
        resourceSingularLabel={intl.get('resource_item_category_singular')}
        resourcePluralLabel={intl.get('resource_item_category_plural')}
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

export const ItemCategoryBulkDeleteDialog = compose(
  withDialogRedux(),
  withDialogActions,
  withItemCategoriesActions,
)(ItemCategoryBulkDeleteDialogInner);
