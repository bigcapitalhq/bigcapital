// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import { useMarkWarehouseAsPrimary } from '@/hooks/query';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';

import { compose } from '@/utils';

/**
 * warehouse mark primary alert.
 */
function WarehouseMarkPrimaryAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { warehouseId },

  // #withAlertActions
  closeAlert,
}) {
  // const { mutateAsync: markPrimaryWarehouseMutate, isLoading } =
  // useMarkWarehouseAsPrimary();

  // Handle cancel mark primary alert.
  const handleCancelMarkPrimaryAlert = () => {
    closeAlert(name);
  };

  // handle cancel mark primary confirm.
  const handleConfirmMarkPrimaryWarehouse = () => {
    markPrimaryWarehouseMutate(warehouseId)
      .then(() => {
        AppToaster.show({
          message: intl.get('warehouse.alert.mark_primary_message'),
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
      confirmButtonText={<T id={'make_primary'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelMarkPrimaryAlert}
      onConfirm={handleConfirmMarkPrimaryWarehouse}
      loading={isLoading}
    >
      <p>
        <T id={'warehouse.alert.are_you_sure_you_want_to_make'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(WarehouseMarkPrimaryAlert);
