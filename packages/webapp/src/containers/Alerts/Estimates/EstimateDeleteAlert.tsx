// @ts-nocheck
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';

import { useDeleteEstimate } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

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

  // #withDrawerActions
  closeDrawer,
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
        closeDrawer(DRAWERS.ESTIMATE_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
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
  withDrawerActions,
)(EstimateDeleteAlert);
