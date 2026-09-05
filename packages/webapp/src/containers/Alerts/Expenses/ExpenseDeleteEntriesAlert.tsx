import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose, saveInvoke } from '@/utils';

interface ExpenseDeleteEntriesAlertPayload {
  // The original `payload: {}` shape — this alert is a generic clear-lines confirmation that doesn't read any payload field.
  [key: string]: unknown;
}

interface ExpenseDeleteEntriesAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ExpenseDeleteEntriesAlertPayload;
  onConfirm?: (event: React.SyntheticEvent<HTMLElement>) => void;
}

/**
 * Alert description.
 */
function ExpenseDeleteEntriesAlertInner({
  name,
  onConfirm,
  isOpen,
  payload,
  closeAlert,
}: ExpenseDeleteEntriesAlertProps): React.ReactElement {
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
        Clearing the table lines will delete all expense amounts were applied,
        Is this okay?
      </p>
    </Alert>
  );
}

export const ExpenseDeleteEntriesAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ExpenseDeleteEntriesAlertInner);
