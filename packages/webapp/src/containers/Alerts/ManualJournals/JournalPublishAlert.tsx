import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { usePublishJournal } from '@/hooks/query';
import { compose } from '@/utils';

interface JournalPublishAlertPayload {
  manualJournalId: number;
  journalNumber: string;
}

interface JournalPublishAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: JournalPublishAlertPayload;
}

/**
 * Journal publish alert.
 */
function JournalPublishAlertInner({
  name,
  isOpen,
  payload: { manualJournalId },
  closeAlert,
}: JournalPublishAlertProps): React.ReactElement {
  const { mutateAsync: publishJournalMutate, isPending: isLoading } =
    usePublishJournal();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirm = () => {
    publishJournalMutate(manualJournalId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_manual_journal_has_been_published'),
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
      confirmButtonText={intl.get('publish')}
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

export const JournalPublishAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(JournalPublishAlertInner);
