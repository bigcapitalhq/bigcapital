import React from 'react';
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

  // handle cancel delete item alert.
  const handleCancelItemDelete = () => {
    closeAlert(name);
  };

  const handleConfirmDeleteItem = () => {
    requestDeleteItem(itemId)
      .then(() => {
        closeAlert(name);
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
      onCancel={handleCancelItemDelete}
      onConfirm={handleConfirmDeleteItem}
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
