import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { WithItemsActionsProps } from '@/containers/Items/withItemsActions';
import {
  AppToaster,
  FormattedHTMLMessage,
  FormattedMessage as T,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { handleDeleteErrors } from '@/containers/Items/utils';
import { withItemsActions } from '@/containers/Items/withItemsActions';
import { useDeleteItem } from '@/hooks/query';
import { compose } from '@/utils';

interface ItemDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps,
    WithItemsActionsProps {
  name: string;
  isOpen: boolean;
  payload: { itemId: number };
}

function ItemDeleteAlertInner({
  name,
  isOpen,
  payload: { itemId },
  closeAlert,
  setItemsTableState,
  closeDrawer,
}: ItemDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteItem, isPending } = useDeleteItem();

  const handleCancelItemDelete = () => {
    closeAlert(name);
  };

  const handleConfirmDeleteItem = () => {
    deleteItem(itemId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_item_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        // @ts-expect-error — latent bug: `page` is not a TableQuery key (should be `pageIndex`). Preserved from @ts-nocheck original.
        setItemsTableState({ page: 1 });
        closeDrawer(DRAWERS.ITEM_DETAILS);
      })
      .catch(({ data: { errors } }) => {
        handleDeleteErrors(errors);
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelItemDelete}
      onConfirm={handleConfirmDeleteItem}
      loading={isPending}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library issue, fixed in source module pending) */}
        <FormattedHTMLMessage
          id={'once_delete_this_item_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const ItemDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withItemsActions,
  withDrawerActions,
)(ItemDeleteAlertInner);
