// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useDeletePaymentReceive } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { handleDeleteErrors } from './_utils';
import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Payment receive delete alert.
 */
function PaymentReceivedDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { paymentReceiveId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deletePaymentReceiveMutate, isLoading } =
    useDeletePaymentReceive();

  // Handle cancel payment Receive.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete payment receive.
  const handleConfirmPaymentReceiveDelete = () => {
    deletePaymentReceiveMutate(paymentReceiveId)
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'the_payment_received_has_been_deleted_successfully',
          ),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.PAYMENT_RECEIVED_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          handleDeleteErrors(errors);
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
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmPaymentReceiveDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_payment_received_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(PaymentReceivedDeleteAlert);
