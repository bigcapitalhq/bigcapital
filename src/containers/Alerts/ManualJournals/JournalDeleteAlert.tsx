import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';
import { useDeleteJournal } from '@/hooks/query';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';

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

  // #withDrawerActions
  closeDrawer,
}) {
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
          message: intl.get('the_journal_has_been_deleted_successfully', {
            number: journalNumber,
          }),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
        closeDrawer('journal-drawer');
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
  withDrawerActions,
)(JournalDeleteAlert);
