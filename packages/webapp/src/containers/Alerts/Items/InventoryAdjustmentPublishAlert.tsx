// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';
import { usePublishInventoryAdjustment } from '@/hooks/query';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';

import { compose } from '@/utils';

/**
 * Inventory Adjustment publish alert.
 */

function InventoryAdjustmentPublishAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { inventoryId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: publishInventoryAdjustmentMutate, isLoading } =
    usePublishInventoryAdjustment();

  // Handle cancel inventory adjustment alert.
  const handleCancelPublish = () => {
    closeAlert(name);
  };

  // Handle publish inventory adjustment confirm.
  const handleConfirmPublish = () => {
    publishInventoryAdjustmentMutate(inventoryId)
      .then(() => {
        AppToaster.show({
          message: intl.get('inventory_adjustment.publish.success_message'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch((error) => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'publish'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelPublish}
      onConfirm={handleConfirmPublish}
      loading={isLoading}
    >
      <p>
        <T id={'inventory_adjustment.publish.alert_message'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(InventoryAdjustmentPublishAlert);
