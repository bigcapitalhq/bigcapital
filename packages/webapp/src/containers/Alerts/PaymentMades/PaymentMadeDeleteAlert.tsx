// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useDeletePaymentMade } from '@/hooks/query';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Payment made delete alert.
 */
function PaymentMadeDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { paymentMadeId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deletePaymentMadeMutate, isLoading } =
    useDeletePaymentMade();

  // Handle cancel payment made.
  const handleCancelPaymentMadeDelete = () => {
    closeAlert(name);
  };

  // Handle confirm delete payment made
  const handleConfirmPaymentMadeDelete = () => {
    deletePaymentMadeMutate(paymentMadeId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_payment_made_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.PAYMENT_MADE_DETAILS);
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon={'trash'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelPaymentMadeDelete}
      onConfirm={handleConfirmPaymentMadeDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_this_payment_made_you_will_able_to_restore_it'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(PaymentMadeDeleteAlert);
