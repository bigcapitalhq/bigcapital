// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';

import { saveInvoke, compose } from '@/utils';

/**
 * Clearing all lines alert.
 */
function ClearingAllLinesAlert({
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
    saveInvoke(onConfirm, event)
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'action'} />}
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

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ClearingAllLinesAlert);
