import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteReconcileCredit } from '@/hooks/query';
import { compose } from '@/utils';

interface ReconcileCreditNoteDeleteAlertPayload {
  creditNoteId: number;
}

interface ReconcileCreditNoteDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: ReconcileCreditNoteDeleteAlertPayload;
}

/**
 * Reconcile credit note delete alert.
 */
function ReconcileCreditNoteDeleteAlertInner({
  name,
  isOpen,
  payload: { creditNoteId },
  closeAlert,
  closeDrawer,
}: ReconcileCreditNoteDeleteAlertProps): React.ReactElement {
  const { isPending: isLoading, mutateAsync: deleteReconcileCreditMutate } =
    useDeleteReconcileCredit();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmVendorCreditDelete = () => {
    deleteReconcileCreditMutate(creditNoteId)
      .then(() => {
        AppToaster.show({
          message: intl.get('reconcile_credit_note.alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had a commented-out `handleDeleteErrors(errors)` and empty catch — failures were silently swallowed.
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
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmVendorCreditDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={
            'reconcile_credit_note.once_you_delete_this_reconcile_credit_note'
          }
        />
      </p>
    </Alert>
  );
}

export const ReconcileCreditNoteDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(ReconcileCreditNoteDeleteAlertInner);
