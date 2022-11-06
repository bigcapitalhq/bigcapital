// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import { useOpenCreditNote } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Credit note opened alert.
 */
function CreditNoteOpenedAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { creditNoteId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: openCreditNoteMutate, isLoading } = useOpenCreditNote();

  // Handle cancel opened credit note alert.
  const handleAlertCancel = () => {
    closeAlert(name);
  };

  // Handle confirm credit note opened.
  const handleAlertConfirm = () => {
    openCreditNoteMutate(creditNoteId)
      .then(() => {
        AppToaster.show({
          message: intl.get('credit_note_opened.alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'open'} />}
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
export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CreditNoteOpenedAlert);
