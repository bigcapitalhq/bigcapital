import React, { useCallback, useState } from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withEstimateActions from 'containers/Sales/Estimate/withEstimateActions';

import { compose } from 'utils';

/**
 * Estimate delete alert.
 */
function EstimateDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withEstimateActions
  requestDeleteEstimate,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);

  // handle cancel delete  alert.
  const handleCancelEstimateDelete = () => {
    closeAlert(name);
  };

  // handle confirm delete estimate
  const handleConfirmEstimateDelete = useCallback(() => {
    setLoading(true);
    requestDeleteEstimate(estimateId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_estimate_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('estimates-table');
      })
      .catch(({ errors }) => {})
      .finally(() => {
        setLoading(false);
        closeAlert(name);
      });
  }, [requestDeleteEstimate, formatMessage, estimateId]);

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      loading={isLoading}
      onCancel={handleCancelEstimateDelete}
      onConfirm={handleConfirmEstimateDelete}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_estimate_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withEstimateActions,
)(EstimateDeleteAlert);
