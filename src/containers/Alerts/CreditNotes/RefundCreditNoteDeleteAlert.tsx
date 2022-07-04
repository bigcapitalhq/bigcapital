import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from '@/components';
import { useDeleteRefundCreditNote } from 'hooks/query';

import withAlertActions from 'containers/Alert/withAlertActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Refund credit transactions delete alert
 */
function RefundCreditNoteDeleteAlert({
  name,
  // #withAlertStoreConnect
  isOpen,
  payload: { creditNoteId },
  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deleteRefundCreditMutate, isLoading } =
    useDeleteRefundCreditNote();

  // Handle cancel delete.
  const handleCancelAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete .
  const handleConfirmRefundCreditDelete = () => {
    deleteRefundCreditMutate(creditNoteId)
      .then(() => {
        AppToaster.show({
          message: intl.get('refund_credit_transactions.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
        closeDrawer('refund-credit-detail-drawer');
      })
      .catch(() => {})
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
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmRefundCreditDelete}
      loading={isLoading}
    >
      <p>
        <T
          id={`refund_credit_transactions.once_your_delete_this_refund_credit_note`}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(RefundCreditNoteDeleteAlert);
