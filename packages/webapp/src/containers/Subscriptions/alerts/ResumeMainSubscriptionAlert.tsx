// @ts-nocheck
import { Intent, Alert } from '@blueprintjs/core';
import * as R from 'ramda';
import React from 'react';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useResumeMainSubscription } from '@/hooks/query/subscription';

/**
 * Resume Unlocking partial transactions alerts.
 */
function ResumeMainSubscriptionAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { module },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: resumeSubscription, isLoading } =
    useResumeMainSubscription();

  // Handle cancel.
  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle confirm.
  const handleConfirm = () => {
    const values = {
      module: module,
    };
    resumeSubscription()
      .then(() => {
        AppToaster.show({
          message: 'The subscription has been resumed.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(({ data: { errors } }) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={'Resume Subscription'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <strong>The subscription for this organization will resume.</strong>

        <p>
          Are you sure want to resume the subscription of this organization?
        </p>
      </p>
    </Alert>
  );
}

export const ResumeMainSubscriptionAlert = R.compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ResumeMainSubscriptionAlertInner);
