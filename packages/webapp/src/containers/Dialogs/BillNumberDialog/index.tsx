// @ts-nocheck
import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const BillNumberDialogContent = lazy(() =>
  import('./BillNumberDialogContent').then((m) => ({
    default: m.BillNumberDialogContent,
  })),
);

function BillNumberDialog({ dialogName, payload = { id: null }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'bill_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--journal-number-settings'}
    >
      <DialogSuspense>
        <BillNumberDialogContent billNumberId={payload.id} />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(BillNumberDialog);
