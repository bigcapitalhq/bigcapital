// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';

import { saveInvoke } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Make journal delete entries alert.
 */
function JournalDeleteEntriesAlertInner({
  // #ownProps
  name,
  onConfirm,

  // #withAlertStoreConnect
  isOpen,
  payload: {},

  // #withAlertActions
  closeAlert,
}) {
  // Handle the alert cancel.
  const handleCancel = () => {
    closeAlert(name);
  };

  // Handle confirm delete manual journal.
  const handleConfirm = (event) => {
    closeAlert(name);
    saveInvoke(onConfirm, event);
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'clear_all_lines'} />}
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

export const JournalDeleteEntriesAlert = flow(
  withAlertActions,
  withAlertStoreConnect(),
)(JournalDeleteEntriesAlertInner);
