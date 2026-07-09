import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  AppToaster,
  FormattedHTMLMessage,
  FormattedMessage as T,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteWarehouseTransfer } from '@/hooks/query';
import { compose } from '@/utils';

interface WarehouseTransferDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: { warehouseTransferId: number };
}

function WarehouseTransferDeleteAlertInner({
  name,
  isOpen,
  payload: { warehouseTransferId },
  closeAlert,
  closeDrawer,
}: WarehouseTransferDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteWarehouseTransferMutate, isPending } =
    useDeleteWarehouseTransfer();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmWarehouseTransferDelete = () => {
    deleteWarehouseTransferMutate(warehouseTransferId)
      .then(() => {
        AppToaster.show({
          message: intl.get('warehouse_transfer.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.WAREHOUSE_TRANSFER_DETAILS);
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmWarehouseTransferDelete}
      loading={isPending}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch */}
        <FormattedHTMLMessage
          id={'warehouse_transfer.once_delete_this_warehouse_transfer'}
        />
      </p>
    </Alert>
  );
}

export const WarehouseTransferDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(WarehouseTransferDeleteAlertInner);
