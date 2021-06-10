import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import {  FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';

import { useDeleteEstimate } from 'hooks/query';

import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Estimate delete alert.
 */
function EstimateDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { estimateId },

  // #withAlertActions
  closeAlert,
}) {
  
  const { mutateAsync: deleteEstimateMutate, isLoading } = useDeleteEstimate();

  // handle cancel delete  alert.
  const handleAlertCancel = () => {
    closeAlert(name);
  };

  // handle confirm delete estimate
  const handleAlertConfirm = () => {
    deleteEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimate_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(({ errors }) => {})
      .finally(() => {
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
      loading={isLoading}
      onCancel={handleAlertCancel}
      onConfirm={handleAlertConfirm}
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
)(EstimateDeleteAlert);
