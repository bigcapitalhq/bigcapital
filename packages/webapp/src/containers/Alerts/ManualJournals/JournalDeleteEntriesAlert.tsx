import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose, saveInvoke } from '@/utils';

interface JournalDeleteEntriesAlertPayload {
  // Empty payload — this alert is a generic clear-lines confirmation that doesn't read any payload field.
  [key: string]: unknown;
}

interface JournalDeleteEntriesAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: JournalDeleteEntriesAlertPayload;
  onConfirm?: (event: React.SyntheticEvent<HTMLElement>) => void;
}

/**
 * Make journal delete entries alert.
 */
function JournalDeleteEntriesAlertInner({
  name,
  onConfirm,
  isOpen,
  payload,
  closeAlert,
}: JournalDeleteEntriesAlertProps): React.ReactElement {
  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirm = (event: React.SyntheticEvent<HTMLElement>) => {
    closeAlert(name);
    saveInvoke(onConfirm, event);
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('clear_all_lines')}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={false}
    >
      <p>
        Clearing the table lines will delete all credits and debits were
        applied, Is this okay?
      </p>
    </Alert>
  );
}

export const JournalDeleteEntriesAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(JournalDeleteEntriesAlertInner);
