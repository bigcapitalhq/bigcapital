import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { useDeleteJournal } from 'hooks/query';

import { AppToaster } from 'components';

import withAlertActions from 'containers/Alert/withAlertActions';
import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';

import { compose } from 'utils';

/**
 * Journal delete alert.
 */
function JournalDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { manualJournalId, journalNumber },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const { mutateAsync: deleteJournalMutate, isLoading } = useDeleteJournal();

  // Handle cancel delete manual journal.
  const handleCancelAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete manual journal.
  const handleConfirmManualJournalDelete = () => {
    deleteJournalMutate(manualJournalId)
      .then(() => {
        AppToaster.show({
          message: formatMessage(
            { id: 'the_journal_has_been_deleted_successfully' },
            { number: journalNumber },
          ),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(() => {
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
      onConfirm={handleConfirmManualJournalDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_this_journal_you_will_able_to_restore_it'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(JournalDeleteAlert);
