import React, { useCallback, useState } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withEstimateActions from 'containers/Sales/Estimate/withEstimateActions';

import { compose } from 'utils';

/**
 * Estimate delivered alert.
 */
function EstimateDeliveredAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withEstimateActions
  requestDeliveredEstimate,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // Handle cancel delivered estimate alert.
  const handleCancelDeliveredEstimate = () => {
    closeAlert(name);
  };

  // Handle confirm estimate delivered.
  const handleConfirmEstimateDelivered = useCallback(() => {
    setLoading(true);
    requestDeliveredEstimate(estimateId)
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
        setLoading(false);
      });
  }, [estimateId, requestDeliveredEstimate, formatMessage]);

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
  withEstimateActions,
)(EstimateDeliveredAlert);
