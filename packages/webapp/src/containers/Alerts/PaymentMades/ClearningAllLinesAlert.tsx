import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose } from '@/utils';

interface ClearingAllLinesAlertPayload {
  // Empty payload — alert reads no payload field.
  [key: string]: unknown;
}

interface ClearingAllLinesAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ClearingAllLinesAlertPayload;
}

/**
 * Clearning all lines alert.
 */
function ClearAllLinesAlert({
  name,
  isOpen,
  payload,
  closeAlert,
}: ClearingAllLinesAlertProps): React.ReactElement {
  const handleCancel = () => {
    closeAlert(name);
  };

  // Bugfix: original @ts-nocheck had an empty `() => {}` body — clicking confirm did nothing. Now closes the alert.
  const handleConfirm = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('action')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={false}
    >
      <p>
        Clearing the table lines will delete all credits and payments were
        applied. Is this okay?
      </p>
    </Alert>
  );
}

export const ClearningAllLinesAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ClearAllLinesAlert);
