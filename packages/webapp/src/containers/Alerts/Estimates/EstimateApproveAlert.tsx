import { Alert, Intent } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useApproveEstimate } from '@/hooks/query';
import { compose } from '@/utils';

interface EstimateApproveAlertPayload {
  estimateId: number;
}

interface EstimateApproveAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: EstimateApproveAlertPayload;
}

/**
 * Estimate approve alert.
 */
function EstimateApproveAlertInner({
  name,
  isOpen,
  payload: { estimateId },
  closeAlert,
}: EstimateApproveAlertProps): React.ReactElement {
  const queryClient = useQueryClient();
  const { mutateAsync: deliverEstimateMutate, isPending: isLoading } =
    useApproveEstimate();

  const handleCancelApproveEstimate = () => {
    closeAlert(name);
  };

  const handleConfirmEstimateApprove = useCallback(() => {
    deliverEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimate_has_been_approved_successfully'),
          intent: Intent.SUCCESS,
        });
        queryClient.invalidateQueries({ queryKey: ['estimates-table'] });
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
  }, [estimateId, deliverEstimateMutate, closeAlert, name, queryClient]);

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('approve')}
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

export const EstimateApproveAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EstimateApproveAlertInner);
