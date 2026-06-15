// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useInitiateWarehouseTransfer } from '@/hooks/query';

import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { flow } from 'fp-ts/function';

/**
 * warehouse transfer initiate alert.
 * @returns
 */
function WarehouseTransferInitiateAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { warehouseTransferId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: initialWarehouseTransferMutate, isLoading } =
    useInitiateWarehouseTransfer();

  // handle cancel alert.
  const handleCancelAlert = () => {
    closeAlert(name);
  };

  // Handle confirm alert.
  const handleConfirmInitiated = () => {
    initialWarehouseTransferMutate(warehouseTransferId)
      .then(() => {
        AppToaster.show({
          message: intl.get('warehouse_transfer.alert.initiate_warehouse'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'warehouse_transfer.label.initiate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmInitiated}
      loading={isLoading}
    >
      <p>
        <T id={'warehouse_transfer.alert.are_you_sure_you_want_to_initate'} />
      </p>
    </Alert>
  );
}

export const WarehouseTransferInitiateAlert = flow(
  withAlertActions,
  withAlertStoreConnect(),
)(WarehouseTransferInitiateAlertInner);
