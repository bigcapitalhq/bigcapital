import React from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { queryCache } from 'react-query';

import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Item Category delete alerts.
 */
function ItemCategoryDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { itemCategoryId },

  // #withItemCategoriesActions
  requestDeleteItemCategory,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();

  // handle cancel delete item category alert.
  const handleCancelItemCategoryDelete = () => {
    closeAlert(name);
  };

  // Handle alert confirm delete item category.
  const handleConfirmItemDelete = () => {
    requestDeleteItemCategory(itemCategoryId)
      .then(() => {
        closeAlert(name);
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_category_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('items-categories-list');
      })
      .catch(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelItemCategoryDelete}
      onConfirm={handleConfirmItemDelete}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_item_category_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withItemCategoriesActions,
)(ItemCategoryDeleteAlert);
