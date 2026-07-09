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
import { useDeleteInventoryAdjustment } from '@/hooks/query';
import { compose } from '@/utils';

interface InventoryAdjustmentDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: { inventoryId: number };
}

function InventoryAdjustmentDeleteAlertInner({
  name,
  isOpen,
  payload: { inventoryId },
  closeAlert,
  closeDrawer,
}: InventoryAdjustmentDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteInventoryAdjMutate, isPending } =
    useDeleteInventoryAdjustment();

  const handleCancelInventoryAdjustmentDelete = () => {
    closeAlert(name);
  };

  const handleConfirmInventoryAdjustmentDelete = () => {
    deleteInventoryAdjMutate(inventoryId)
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'the_adjustment_transaction_has_been_deleted_successfully',
          ),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.INVENTORY_ADJUSTMENT_DETAILS);
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
      onCancel={handleCancelInventoryAdjustmentDelete}
      onConfirm={handleConfirmInventoryAdjustmentDelete}
      loading={isPending}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch */}
        <FormattedHTMLMessage
          id={
            'once_delete_this_inventory_a_adjustment_you_will_able_to_restore_it'
          }
        />
      </p>
    </Alert>
  );
}

export const InventoryAdjustmentDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(InventoryAdjustmentDeleteAlertInner);
