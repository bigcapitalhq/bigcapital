import React, { useCallback } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';

import { AppToaster } from 'components';
import { useRejectEstimate } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withEstimateActions from 'containers/Sales/Estimate/withEstimateActions';

import { compose } from 'utils';

/**
 *  Estimate reject delete alerts.
 */
function EstimateRejectAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withEstimateActions
  requestRejectEstimate,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const {
    mutateAsync: rejectEstimateMutate,
    isLoading
  } = useRejectEstimate();

  // Handle cancel reject estimate alert.
  const handleCancelRejectEstimate = () => {
    closeAlert(name);
  };

  // Handle confirm estimate reject.
  const handleConfirmEstimateReject = useCallback(() => {
    requestRejectEstimate(estimateId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_rejected_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  }, [estimateId, rejectEstimateMutate, formatMessage]);

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
        <T id={'are_sure_to_approve_this_estimate'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withEstimateActions,
)(EstimateRejectAlert);
