import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useDeleteLandedCost } from '@/hooks/query';
import { compose } from '@/utils';

interface BillLocatedLandedCostDeleteAlertPayload {
  // Capital-B `BillId` is intentional — caller `LocatedLandedCostTable.tsx:40` opens this alert with the same field name.
  BillId: number;
}

interface BillLocatedLandedCostDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: BillLocatedLandedCostDeleteAlertPayload;
}

/**
 *  Bill transaction delete alert.
 */
function BillTransactionDeleteAlert({
  name,
  isOpen,
  payload: { BillId },
  closeAlert,
}: BillLocatedLandedCostDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteLandedCostMutate, isPending: isLoading } =
    useDeleteLandedCost();

  const handleCancelAlert = () => {
    closeAlert(name);
  };

  const handleConfirmLandedCostDelete = () => {
    deleteLandedCostMutate(BillId)
      .then(() => {
        AppToaster.show({
          message: intl.get('landed_cost.action.delete.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch(() => closeAlert(name))` that silently swallowed failures.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
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
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmLandedCostDelete}
      loading={isLoading}
    >
      <p>
        <T id={`landed_cost.once_your_delete_this_located_landed_cost`} />
      </p>
    </Alert>
  );
}

export const BillLocatedLandedCostDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(BillTransactionDeleteAlert);
