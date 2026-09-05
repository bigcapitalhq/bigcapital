import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useOpenCreditNote } from '@/hooks/query';
import { compose } from '@/utils';

interface CreditNoteOpenedAlertPayload {
  creditNoteId: number;
}

interface CreditNoteOpenedAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: CreditNoteOpenedAlertPayload;
}

/**
 * Credit note opened alert.
 */
function CreditNoteOpenedAlertInner({
  name,
  isOpen,
  payload: { creditNoteId },
  closeAlert,
}: CreditNoteOpenedAlertProps): React.ReactElement {
  const { mutateAsync: openCreditNoteMutate, isPending: isLoading } =
    useOpenCreditNote();

  const handleAlertCancel = () => {
    closeAlert(name);
  };

  const handleAlertConfirm = () => {
    openCreditNoteMutate(creditNoteId)
      .then(() => {
        AppToaster.show({
          message: intl.get('credit_note_opened.alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch((error) => {})` that silently swallowed failures.
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
      confirmButtonText={intl.get('open')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleAlertCancel}
      onConfirm={handleAlertConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'credit_note_opened.are_sure_to_open_this_credit'} />
      </p>
    </Alert>
  );
}

export const CreditNoteOpenedAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CreditNoteOpenedAlertInner);
