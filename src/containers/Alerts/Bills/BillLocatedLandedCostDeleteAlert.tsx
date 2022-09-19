// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { useDeleteLandedCost } from '@/hooks/query';

import { AppToaster } from '@/components';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';

import { compose } from '@/utils';

/**
 *  Bill transaction delete alert.
 */
function BillTransactionDeleteAlert({
  name,
  // #withAlertStoreConnect
  isOpen,
  payload: { BillId },
  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteLandedCostMutate, isLoading } =
    useDeleteLandedCost();

  // Handle cancel delete.
  const handleCancelAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete .
  const handleConfirmLandedCostDelete = () => {
    deleteLandedCostMutate(BillId)
      .then(() => {
        AppToaster.show({
          message: intl.get('landed_cost.action.delete.success_message'),
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
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
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

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(BillTransactionDeleteAlert);
