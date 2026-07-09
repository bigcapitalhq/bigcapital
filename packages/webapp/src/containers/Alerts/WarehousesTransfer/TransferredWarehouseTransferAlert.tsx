import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useTransferredWarehouseTransfer } from '@/hooks/query';
import { compose } from '@/utils';

interface TransferredWarehouseTransferAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { warehouseTransferId: number };
}

function TransferredWarehouseTransferAlertInner({
  name,
  isOpen,
  payload: { warehouseTransferId },
  closeAlert,
}: TransferredWarehouseTransferAlertProps): React.ReactElement {
  const { mutateAsync: transferredWarehouseTransferMutate, isPending } =
    useTransferredWarehouseTransfer();

  const handleCancelAlert = () => {
    closeAlert(name);
  };

  const handleConfirmTransferred = () => {
    transferredWarehouseTransferMutate(warehouseTransferId)
      .then(() => {
        AppToaster.show({
          message: intl.get('warehouse_transfer.alert.transferred_warehouse'),
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
      confirmButtonText={intl.get('deliver')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmTransferred}
      loading={isPending}
    >
      <p>
        <T id={'warehouse_transfer.alert.are_you_sure_you_want_to_deliver'} />
      </p>
    </Alert>
  );
}

export const TransferredWarehouseTransferAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(TransferredWarehouseTransferAlertInner);
