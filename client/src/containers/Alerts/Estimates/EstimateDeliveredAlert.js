import React, { useCallback, useState } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';

import { useDeliverEstimate } from 'hooks/query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Estimate delivered alert.
 */
function EstimateDeliveredAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const { mutateAsync: deliverEstimateMutate, isLoading } = useDeliverEstimate();

  // Handle cancel delivered estimate alert.
  const handleCancelDeliveredEstimate = () => {
    closeAlert(name);
  };

  // Handle confirm estimate delivered.
  const handleConfirmEstimateDelivered = useCallback(() => {
    deliverEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_delivered_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  }, [estimateId, deliverEstimateMutate, formatMessage]);

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'deliver'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelDeliveredEstimate}
      onConfirm={handleConfirmEstimateDelivered}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_deliver_this_estimate'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EstimateDeliveredAlert);
