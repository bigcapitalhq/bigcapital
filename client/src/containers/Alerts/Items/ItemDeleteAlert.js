import React, { useState } from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import { handleDeleteErrors } from 'containers/Items/utils';

import withItemsActions from 'containers/Items/withItemsActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Item delete alerts.
 */
function ItemDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { itemId },

  // #withItemsActions
  requestDeleteItem,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel delete item alert.
  const handleCancelItemDelete = () => {
    closeAlert(name);
  };

  const handleConfirmDeleteItem = () => {
    setLoading(true);
    requestDeleteItem(itemId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('items-table');
      })
      .catch(({ errors }) => {
        handleDeleteErrors(errors);
      })
      .finally(() => {
        closeAlert(name);
        setLoading(false);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelItemDelete}
      onConfirm={handleConfirmDeleteItem}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_item_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withItemsActions,
)(ItemDeleteAlert);
