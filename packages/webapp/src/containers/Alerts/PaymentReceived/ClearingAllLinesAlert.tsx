import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { saveInvoke, compose } from '@/utils';

interface ClearingAllLinesAlertPayload {
  // Empty payload — alert reads no payload field.
  [key: string]: unknown;
}

interface ClearingAllLinesAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ClearingAllLinesAlertPayload;
  onConfirm?: (event: React.SyntheticEvent<HTMLElement>) => void;
}

/**
 * Clearning all lines alert.
 */
function ClearningAllLinesAlert({
  name,
  onConfirm,
  isOpen,
  payload,
  closeAlert,
}: ClearingAllLinesAlertProps): React.ReactElement {
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
      confirmButtonText={intl.get('action')}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    >
      <p>
        <T id={'clearing_the_table_lines_will_delete_all_credits'} />
      </p>
    </Alert>
  );
}

export const ClearingAllLinesAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ClearningAllLinesAlert);
