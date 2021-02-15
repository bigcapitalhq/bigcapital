import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';

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
  const handleAlertCancel = () => {
    closeAlert(name);
  };

  // Handle confirm estimate delivered.
  const handleAlertConfirm = () => {
    deliverEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_delivered_successfully',
          }),
          intent: Intent.SUCCESS,
        })
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'deliver'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleAlertCancel}
      onConfirm={handleAlertConfirm}
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
