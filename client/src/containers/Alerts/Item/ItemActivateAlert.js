import React from 'react';
import {
  FormattedMessage as T,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withItemsActions from 'containers/Items/withItemsActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 *  Item activate alert.
 */
function ItemActivateAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { itemId },

  // #withItemsActions
  requestActivateItem,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();

  // Handle activate item alert cancel.
  const handleCancelActivateItem = () => {
    closeAlert(name);
  };

  // Handle confirm item activated.
  const handleConfirmItemActivate = () => {
    requestActivateItem(itemId)
      .then(() => {
        closeAlert(name);
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_has_been_activated_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('items-table');
      })
      .catch((error) => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateItem}
      onConfirm={handleConfirmItemActivate}
    >
      <p>
        <T id={'are_sure_to_activate_this_item'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withItemsActions,
)(ItemActivateAlert);
