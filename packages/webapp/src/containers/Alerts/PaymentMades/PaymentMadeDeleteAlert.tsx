import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { handleDeleteErrors } from './_utils';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeletePaymentMade } from '@/hooks/query';
import { compose } from '@/utils';

interface PaymentMadeDeleteAlertPayload {
  paymentMadeId: number;
}

interface PaymentMadeDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: PaymentMadeDeleteAlertPayload;
}

/**
 * Payment made delete alert.
 */
function PaymentMadeDeleteAlertInner({
  name,
  isOpen,
  payload: { paymentMadeId },
  closeAlert,
  closeDrawer,
}: PaymentMadeDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deletePaymentMadeMutate, isPending: isLoading } =
    useDeletePaymentMade();

  const handleCancelPaymentMadeDelete = () => {
    closeAlert(name);
  };

  const handleConfirmPaymentMadeDelete = () => {
    deletePaymentMadeMutate(paymentMadeId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_payment_made_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.PAYMENT_MADE_DETAILS);
      })
      .catch(
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
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

export const PaymentMadeDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(PaymentMadeDeleteAlertInner);
