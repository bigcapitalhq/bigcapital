import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useRejectEstimate } from '@/hooks/query';
import { compose } from '@/utils';

interface EstimateRejectAlertPayload {
  estimateId: number;
}

interface EstimateRejectAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: EstimateRejectAlertPayload;
}

/**
 *  Estimate reject delete alerts.
 */
function EstimateRejectAlertInner({
  name,
  isOpen,
  payload: { estimateId },
  closeAlert,
}: EstimateRejectAlertProps): React.ReactElement {
  const { mutateAsync: rejectEstimateMutate, isPending: isLoading } =
    useRejectEstimate();

  const handleCancelRejectEstimate = () => {
    closeAlert(name);
  };

  const handleConfirmEstimateReject = () => {
    rejectEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimate_has_been_rejected_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch((error) => {})` that silently swallowed failures.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('reject')}
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

export const EstimateRejectAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EstimateRejectAlertInner);
