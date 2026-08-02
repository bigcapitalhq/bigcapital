import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { handleDeleteErrors } from './_utils';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useDeletePaymentReceive } from '@/hooks/query';
import { compose } from '@/utils';

interface PaymentReceivedDeleteAlertPayload {
  paymentReceiveId: number;
}

interface PaymentReceivedDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: PaymentReceivedDeleteAlertPayload;
}

/**
 * Payment receive delete alert.
 */
function PaymentReceivedDeleteAlertInner({
  name,
  isOpen,
  payload: { paymentReceiveId },
  closeAlert,
  closeDrawer,
}: PaymentReceivedDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deletePaymentReceiveMutate, isPending: isLoading } =
    useDeletePaymentReceive();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

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
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmPaymentReceiveDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={'once_delete_this_payment_received_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const PaymentReceivedDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(PaymentReceivedDeleteAlertInner);
