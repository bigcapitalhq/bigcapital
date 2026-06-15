// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';

import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';

import { saveInvoke } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Changing full-amount alert in payment made form.
 */
function ChangingFullAmountAlertInner({
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
      confirmButtonText={<T id={'ok'} />}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    >
      <p>
        Changing full amount will change all credit and payment were applied, Is
        this okay?
      </p>
    </Alert>
  );
}

export const ChangingFullAmountAlert = flow(
  withAlertActions,
  withAlertStoreConnect(),
)(ChangingFullAmountAlertInner);
