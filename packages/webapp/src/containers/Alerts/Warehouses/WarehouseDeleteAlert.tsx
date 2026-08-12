import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import {
  AppToaster,
  FormattedHTMLMessage,
  FormattedMessage as T,
} from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { handleDeleteErrors } from '@/containers/Preferences/Warehouses/utils';
import { useDeleteWarehouse } from '@/hooks/query';
import { compose } from '@/utils';

interface WarehouseDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { warehouseId: number };
}

function WarehouseDeleteAlertInner({
  name,
  isOpen,
  payload: { warehouseId },
  closeAlert,
}: WarehouseDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteWarehouseMutate, isPending } =
    useDeleteWarehouse();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmWarehouseDelete = () => {
    deleteWarehouseMutate(warehouseId)
      .then(() => {
        AppToaster.show({
          message: intl.get('warehouse.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(({ data: { errors } }) => {
        handleDeleteErrors(errors);
      })
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
      onConfirm={handleConfirmWarehouseDelete}
      loading={isPending}
    >
      <p data-testId={'warehouse-delete-alert'}>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch */}
        <FormattedHTMLMessage id={'warehouse.once_delete_this_warehouse'} />
      </p>
    </Alert>
  );
}

export const WarehouseDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(WarehouseDeleteAlertInner);
