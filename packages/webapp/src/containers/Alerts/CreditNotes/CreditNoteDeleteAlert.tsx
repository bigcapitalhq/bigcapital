// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useDeleteCreditNote } from '@/hooks/query';
import { handleDeleteErrors } from '@/containers/Sales/CreditNotes/CreditNotesLanding/utils';
import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Credit note delete alert.
 */
function CreditNoteDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { creditNoteId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { isLoading, mutateAsync: deleteCreditNoteMutate } =
    useDeleteCreditNote();

  // handle cancel delete credit note alert.
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
      onConfirm={handleConfirmCreditNoteDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage id={'credit_note.once_delete_this_credit_note'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(CreditNoteDeleteAlert);
