import React from 'react';
import { Alert } from '@blueprintjs/core';

function ChangingFullAmountAlert() {
  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'ok'} />}
      intent={Intent.DANGER}
      isOpen={amountChangeAlert}
      onCancel={handleCancelAmountChangeAlert}
      onConfirm={handleConfirmAmountChangeAlert}
    >
      <p>
        Changing full amount will change all credit and payment were applied, Is
        this okay?
      </p>
    </Alert>
  );
}
