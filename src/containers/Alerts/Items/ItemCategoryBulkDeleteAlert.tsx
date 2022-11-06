// @ts-nocheck
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import {  FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';
import { size } from 'lodash';
import { AppToaster } from '@/components';

import withItemCategoriesActions from '@/containers/ItemsCategories/withItemCategoriesActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Item category bulk delete alerts.
 */
function ItemCategoryBulkDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { itemCategoriesIds },

  // #withItemCategoriesActions
  requestDeleteBulkItemCategories,

  // #withAlertActions
  closeAlert,
}) {
  
  const [isLoading, setLoading] = useState(false);

  // handle cancel bulk delete alert.
  const handleCancelBulkDelete = () => {
    closeAlert(name);
  };

  // handle confirm itemCategories bulk delete.
  const handleConfirmBulkDelete = () => {
    setLoading(true);
    requestDeleteBulkItemCategories(itemCategoriesIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_item_categories_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {})
      .finally(() => {
        closeAlert(name);
        setLoading(false);
      });
  };
  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: size(itemCategoriesIds) }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelBulkDelete}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={
            'once_delete_these_item_categories_you_will_not_able_restore_them'
          }
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withItemCategoriesActions,
)(ItemCategoryBulkDeleteAlert);
