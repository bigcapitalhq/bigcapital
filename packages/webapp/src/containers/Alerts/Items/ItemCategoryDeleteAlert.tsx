import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import {
  AppToaster,
  FormattedHTMLMessage,
  FormattedMessage as T,
} from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useDeleteItemCategory } from '@/hooks/query';
import { compose } from '@/utils';

interface ItemCategoryDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { itemCategoryId: number };
}

function ItemCategoryDeleteAlertInner({
  name,
  isOpen,
  payload: { itemCategoryId },
  closeAlert,
}: ItemCategoryDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteItemCategory, isPending } =
    useDeleteItemCategory();

  const handleCancelItemCategoryDelete = () => {
    closeAlert(name);
  };

  const handleConfirmItemDelete = () => {
    deleteItemCategory(itemCategoryId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_item_category_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
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
      onCancel={handleCancelItemCategoryDelete}
      onConfirm={handleConfirmItemDelete}
      loading={isPending}
    >
      <p data-testId={'category-delete-alert'}>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch */}
        <FormattedHTMLMessage
          id={'once_delete_this_item_category_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const ItemCategoryDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ItemCategoryDeleteAlertInner);
