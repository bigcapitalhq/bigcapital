import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { usePublishInventoryAdjustment } from '@/hooks/query';

interface InventoryAdjustmentPublishAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { inventoryId: number };
}

function InventoryAdjustmentPublishAlertInner({
  name,
  isOpen,
  payload: { inventoryId },
  closeAlert,
}: InventoryAdjustmentPublishAlertProps): React.ReactElement {
  const { mutateAsync: publishInventoryAdjustmentMutate, isPending } =
    usePublishInventoryAdjustment();

  const handleCancelPublish = () => {
    closeAlert(name);
  };

  const handleConfirmPublish = () => {
    publishInventoryAdjustmentMutate(inventoryId)
      .then(() => {
        AppToaster.show({
          message: intl.get('inventory_adjustment.publish.success_message'),
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
      confirmButtonText={intl.get('publish')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelPublish}
      onConfirm={handleConfirmPublish}
      loading={isPending}
    >
      <p>
        <T id={'inventory_adjustment.publish.alert_message'} />
      </p>
    </Alert>
  );
}

export const InventoryAdjustmentPublishAlert = FF.pipe(
  InventoryAdjustmentPublishAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
