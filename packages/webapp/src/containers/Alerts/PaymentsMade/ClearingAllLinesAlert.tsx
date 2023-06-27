// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import withAlertActions from '@/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';

import { compose } from '@/utils';

/**
 * Clearing all lines alert.
 */
function ClearAllLinesAlert({
  name,

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
  const handleConfirm = () => {};

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'action'} />}
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

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ClearAllLinesAlert);
