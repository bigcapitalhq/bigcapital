import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useMarkWarehouseAsPrimary } from '@/hooks/query';
import { compose } from '@/utils';

interface WarehouseMarkPrimaryAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { warehouseId: number };
}

function WarehouseMarkPrimaryAlertInner({
  name,
  isOpen,
  payload: { warehouseId },
  closeAlert,
}: WarehouseMarkPrimaryAlertProps): React.ReactElement {
  const { mutateAsync: markPrimaryWarehouseMutate, isPending } =
    useMarkWarehouseAsPrimary();

  const handleCancelMarkPrimaryAlert = () => {
    closeAlert(name);
  };

  const handleConfirmMarkPrimaryWarehouse = () => {
    markPrimaryWarehouseMutate(warehouseId)
      .then(() => {
        AppToaster.show({
          message: intl.get('warehouse.alert.mark_primary_message'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('make_primary')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelMarkPrimaryAlert}
      onConfirm={handleConfirmMarkPrimaryWarehouse}
      loading={isPending}
    >
      <p>
        <T id={'warehouse.alert.are_you_sure_you_want_to_make'} />
      </p>
    </Alert>
  );
}

export const WarehouseMarkPrimaryAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(WarehouseMarkPrimaryAlertInner);
