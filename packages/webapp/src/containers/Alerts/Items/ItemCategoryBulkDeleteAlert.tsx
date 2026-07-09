import { Alert, Intent } from '@blueprintjs/core';
import { size } from 'lodash';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import {
  AppToaster,
  FormattedHTMLMessage,
  FormattedMessage as T,
} from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withItemCategoriesActions } from '@/containers/ItemsCategories/withItemCategoriesActions';
import { compose } from '@/utils';

interface ItemCategoryBulkDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { itemCategoriesIds: number[] };
  requestDeleteBulkItemCategories: (ids: number[]) => Promise<void>;
}

function ItemCategoryBulkDeleteAlertInner({
  name,
  isOpen,
  payload: { itemCategoriesIds },
  requestDeleteBulkItemCategories,
  closeAlert,
}: ItemCategoryBulkDeleteAlertProps): React.ReactElement {
  const [isLoading, setLoading] = useState(false);

  const handleCancelBulkDelete = () => {
    closeAlert(name);
  };

  const handleConfirmBulkDelete = () => {
    setLoading(true);
    requestDeleteBulkItemCategories(itemCategoriesIds)
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'the_item_categories_has_been_deleted_successfully',
          ),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
        setLoading(false);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete_count', {
        count: size(itemCategoriesIds),
      })}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelBulkDelete}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch */}
        <FormattedHTMLMessage
          id={
            'once_delete_these_item_categories_you_will_not_able_restore_them'
          }
        />
      </p>
    </Alert>
  );
}

export const ItemCategoryBulkDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withItemCategoriesActions,
)(ItemCategoryBulkDeleteAlertInner);
