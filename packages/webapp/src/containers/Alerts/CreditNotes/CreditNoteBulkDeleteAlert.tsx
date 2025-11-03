// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { useBulkDeleteCreditNotes } from '@/hooks/query/creditNote';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Credit note bulk delete alert.
 */
function CreditNoteBulkDeleteAlert({
  name,
  isOpen,
  payload: { creditNotesIds },
  closeAlert,
}) {
  const { mutateAsync: bulkDeleteCreditNotes, isLoading } = useBulkDeleteCreditNotes();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteCreditNotes(creditNotesIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_credit_notes_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('credit-notes-table');
        closeAlert(name);
      })
      .catch((errors) => {
        // Handle errors
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: creditNotesIds?.length || 0 }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_these_credit_notes_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CreditNoteBulkDeleteAlert);

