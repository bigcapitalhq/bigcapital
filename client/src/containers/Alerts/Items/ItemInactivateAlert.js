import React, { useState } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withItemsActions from 'containers/Items/withItemsActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Item inactivate alert.
 */
function ItemInactivateAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { itemId },

  // #withItemsActions
  requestInactiveItem,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel inactivate alert.
  const handleCancelInactivateItem = () => {
    closeAlert(name);
  };

  // Handle confirm item Inactive.
  const handleConfirmItemInactive = () => {
    setLoading(true);
    requestInactiveItem(itemId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_item_has_been_inactivated_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('items-table');
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'inactivate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactivateItem}
      onConfirm={handleConfirmItemInactive}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_inactive_this_item'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withItemsActions,
)(ItemInactivateAlert);
