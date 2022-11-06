// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useRejectEstimate } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 *  Estimate reject delete alerts.
 */
function EstimateRejectAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: rejectEstimateMutate, isLoading } = useRejectEstimate();

  // Handle cancel reject estimate alert.
  const handleCancelRejectEstimate = () => {
    closeAlert(name);
  };

  // Handle confirm estimate reject.
  const handleConfirmEstimateReject = () => {
    rejectEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimate_has_been_rejected_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'reject'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelRejectEstimate}
      onConfirm={handleConfirmEstimateReject}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_reject_this_estimate'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EstimateRejectAlert);
