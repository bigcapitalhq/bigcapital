import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { handleDeleteErrors } from '@/containers/Sales/CreditNotes/CreditNotesLanding/utils';
import { useDeleteCreditNote } from '@/hooks/query';
import { compose } from '@/utils';

interface CreditNoteDeleteAlertPayload {
  creditNoteId: number;
}

interface CreditNoteDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: CreditNoteDeleteAlertPayload;
}

/**
 * Credit note delete alert.
 */
function CreditNoteDeleteAlertInner({
  name,
  isOpen,
  payload: { creditNoteId },
  closeAlert,
  closeDrawer,
}: CreditNoteDeleteAlertProps): React.ReactElement {
  const { isPending: isLoading, mutateAsync: deleteCreditNoteMutate } =
    useDeleteCreditNote();

  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmCreditNoteDelete = () => {
    deleteCreditNoteMutate(creditNoteId)
      .then(() => {
        AppToaster.show({
          message: intl.get('credit_note.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.CREDIT_NOTE_DETAILS);
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
      onConfirm={handleConfirmCreditNoteDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage id={'credit_note.once_delete_this_credit_note'} />
      </p>
    </Alert>
  );
}

export const CreditNoteDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(CreditNoteDeleteAlertInner);
