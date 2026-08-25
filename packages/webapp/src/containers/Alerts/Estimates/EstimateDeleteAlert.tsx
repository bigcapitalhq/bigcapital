import { Alert, Intent } from '@blueprintjs/core';
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useDeleteEstimate } from '@/hooks/query';
import { compose } from '@/utils';

interface EstimateDeleteAlertPayload {
  estimateId: number;
}

interface EstimateDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: EstimateDeleteAlertPayload;
}

interface EstimateDeleteError {
  type: string;
}

/**
 * Estimate delete alert.
 */
function EstimateDeleteAlertInner({
  name,
  isOpen,
  payload: { estimateId },
  closeAlert,
  closeDrawer,
}: EstimateDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteEstimateMutate, isPending: isLoading } =
    useDeleteEstimate();

  const handleAlertCancel = useCallback(() => {
    closeAlert(name);
  }, [closeAlert, name]);

  const handleAlertConfirm = useCallback(() => {
    deleteEstimateMutate(estimateId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_estimate_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.ESTIMATE_DETAILS);
      })
      .catch(
        ({ data: { errors } }: { data: { errors: EstimateDeleteError[] } }) => {
          if (
            errors.find((e) => e.type === 'SALE_ESTIMATE_CONVERTED_TO_INVOICE')
          ) {
            AppToaster.show({
              intent: Intent.DANGER,
              message: intl.get(
                'estimate.delete.error.estimate_converted_to_invoice',
              ),
            });
          }
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  }, [estimateId, deleteEstimateMutate, closeDrawer, closeAlert, name]);

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      loading={isLoading}
      onCancel={handleAlertCancel}
      onConfirm={handleAlertConfirm}
    >
      <p data-testId={'estimate-delete-alert'}>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={'once_delete_this_estimate_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const EstimateDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(EstimateDeleteAlertInner);
