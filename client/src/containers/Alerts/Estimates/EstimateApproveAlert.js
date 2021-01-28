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
 * Estimate Approve alert.
 */
function EstimateApproveAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withEstimateActions
  requestApproveEstimate,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel approve alert.
  const handleCancelApproveEstimate = () => {
    closeAlert(name);
  };
  // Handle confirm estimate approve.
  const handleConfirmEstimateApprove = useCallback(() => {
    setLoading(true);
    requestApproveEstimate(estimateId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_approved_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
        closeAlert(name);
      });
  }, [estimateId, requestApproveEstimate, formatMessage]);

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'approve'} />}
      icon="trash"
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
  withEstimateActions,
)(EstimateApproveAlert);
