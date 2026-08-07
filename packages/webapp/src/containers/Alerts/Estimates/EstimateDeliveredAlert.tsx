import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useDeliverEstimate } from '@/hooks/query';
import { compose } from '@/utils';

interface EstimateDeliveredAlertPayload {
  estimateId: number;
}

interface EstimateDeliveredAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: EstimateDeliveredAlertPayload;
}

/**
 * Estimate delivered alert.
 */
function EstimateDeliveredAlertInner({
  name,
  isOpen,
  payload: { estimateId },
  closeAlert,
}: EstimateDeliveredAlertProps): React.ReactElement {
  const { mutateAsync: deliverEstimateMutate, isPending: isLoading } =
    useDeliverEstimate();

  const handleAlertCancel = () => {
    closeAlert(name);
  };

  const handleAlertConfirm = () => {
    deliverEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimate_has_been_delivered_successfully'),
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
      confirmButtonText={intl.get('deliver')}
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

export const EstimateDeliveredAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EstimateDeliveredAlertInner);
