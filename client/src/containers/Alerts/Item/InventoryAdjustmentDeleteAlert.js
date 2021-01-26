import React from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withInventoryAdjustmentActions from 'containers/Items/withInventoryAdjustmentActions';

import { compose } from 'utils';

/**
 * Inventory Adjustment delete alerts.
 */
function InventoryAdjustmentDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { inventoryId },
  // #withInventoryAdjustmentActions
  requestDeleteInventoryAdjustment,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();

  // handle cancel delete  alert.
  const handleCancelInventoryAdjustmentDelete = () => {
    closeAlert(name);
  };

  const handleConfirmInventoryAdjustmentDelete = () => {
    requestDeleteInventoryAdjustment(inventoryId)
      .then(() => {
        closeAlert(name);
        AppToaster.show({
          message: formatMessage({
            id: 'the_adjustment_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('inventory-adjustment-list');
      })
      .catch((errors) => {
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
      onCancel={handleCancelInventoryAdjustmentDelete}
      onConfirm={handleConfirmInventoryAdjustmentDelete}
    >
      <p>
        <FormattedHTMLMessage
          id={
            'once_delete_this_inventory_a_adjustment_you_will_able_to_restore_it'
          }
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withInventoryAdjustmentActions,
)(InventoryAdjustmentDeleteAlert);
