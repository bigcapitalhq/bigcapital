// @ts-nocheck
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';

import { useApproveEstimate } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Estimate approve alert.
 */
function EstimateApproveAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deliverEstimateMutate, isLoading } =
    useApproveEstimate();

  // handle cancel approve alert.
  const handleCancelApproveEstimate = () => {
    closeAlert(name);
  };
  // Handle confirm estimate approve.
  const handleConfirmEstimateApprove = useCallback(() => {
    deliverEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimate_has_been_approved_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  }, [estimateId, deliverEstimateMutate, closeAlert, name]);

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'approve'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      loading={isLoading}
      onCancel={handleCancelApproveEstimate}
      onConfirm={handleConfirmEstimateApprove}
    >
      <p>
        <T id={'are_sure_to_approve_this_estimate'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EstimateApproveAlert);
