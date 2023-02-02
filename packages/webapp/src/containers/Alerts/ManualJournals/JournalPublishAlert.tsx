// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster,FormattedMessage as T } from '@/components';
import { usePublishJournal } from '@/hooks/query';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';

import { compose } from '@/utils';

/**
 * Journal publish alert.
 */
function JournalPublishAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { manualJournalId, journalNumber },

  // #withAlertActions
  closeAlert,
}) {
  
  const { mutateAsync: publishJournalMutate, isLoading } = usePublishJournal();

  // Handle cancel manual journal alert.
  const handleCancel = () => {
    closeAlert(name);
  };

  // Handle publish manual journal confirm.
  const handleConfirm = () => {
    publishJournalMutate(manualJournalId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_manual_journal_has_been_published'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        
      })
      .finally(() => {
        closeAlert(name);
      });
  };
  
  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'publish'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_publish_this_manual_journal'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(JournalPublishAlert)