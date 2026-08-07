import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useInitiateWarehouseTransfer } from '@/hooks/query';
import { compose } from '@/utils';

interface WarehouseTransferInitiateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { warehouseTransferId: number };
}

function WarehouseTransferInitiateAlertInner({
  name,
  isOpen,
  payload: { warehouseTransferId },
  closeAlert,
}: WarehouseTransferInitiateAlertProps): React.ReactElement {
  const { mutateAsync: initialWarehouseTransferMutate, isPending } =
    useInitiateWarehouseTransfer();

  const handleCancelAlert = () => {
    closeAlert(name);
  };

  const handleConfirmInitiated = () => {
    initialWarehouseTransferMutate(warehouseTransferId)
      .then(() => {
        AppToaster.show({
          message: intl.get('warehouse_transfer.alert.initiate_warehouse'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('warehouse_transfer.label.initiate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmInitiated}
      loading={isPending}
    >
      <p>
        <T id={'warehouse_transfer.alert.are_you_sure_you_want_to_initate'} />
      </p>
    </Alert>
  );
}

export const WarehouseTransferInitiateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(WarehouseTransferInitiateAlertInner);
