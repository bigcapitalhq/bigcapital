import React from 'react';
import intl from 'react-intl-universal';
import {  FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import {
  useDeleteInventoryAdjustment
} from 'hooks/query';

import { compose } from 'utils';

/**
 * Inventory Adjustment delete alerts.
 */
function InventoryAdjustmentDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { inventoryId },

  // #withAlertActions
  closeAlert,
}) {
  
  const {
    mutateAsync: deleteInventoryAdjMutate,
    isLoading
  } = useDeleteInventoryAdjustment();

  // handle cancel delete alert.
  const handleCancelInventoryAdjustmentDelete = () => {
    closeAlert(name);
  };

  // Handle the confirm delete of the inventory adjustment transaction.
  const handleConfirmInventoryAdjustmentDelete = () => {
    deleteInventoryAdjMutate(inventoryId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_adjustment_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {})
      .finally(() => {
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
      loading={isLoading}
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
)(InventoryAdjustmentDeleteAlert);
