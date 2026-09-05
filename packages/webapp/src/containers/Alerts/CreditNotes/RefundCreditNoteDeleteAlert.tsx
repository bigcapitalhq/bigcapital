import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteRefundCreditNote } from '@/hooks/query';
import { compose } from '@/utils';

interface RefundCreditNoteDeleteAlertPayload {
  creditNoteId: number;
}

interface RefundCreditNoteDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: RefundCreditNoteDeleteAlertPayload;
}

/**
 * Refund credit transactions delete alert
 */
function RefundCreditNoteDeleteAlertInner({
  name,
  isOpen,
  payload: { creditNoteId },
  closeAlert,
  closeDrawer,
}: RefundCreditNoteDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteRefundCreditMutate, isPending: isLoading } =
    useDeleteRefundCreditNote();

  const handleCancelAlert = () => {
    closeAlert(name);
  };

  const handleConfirmRefundCreditDelete = () => {
    deleteRefundCreditMutate(creditNoteId)
      .then(() => {
        AppToaster.show({
          message: intl.get('refund_credit_transactions.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.REFUND_CREDIT_NOTE_DETAILS);
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch(() => {})` that silently swallowed failures.
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
      confirmButtonText={intl.get('delete')}
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

export const RefundCreditNoteDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(RefundCreditNoteDeleteAlertInner);
