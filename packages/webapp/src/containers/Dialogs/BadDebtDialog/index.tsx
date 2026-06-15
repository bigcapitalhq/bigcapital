// @ts-nocheck
import React from 'react';

import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from 'redux';
import { flow } from 'fp-ts/function';

const BadDebtDialogContent = React.lazy(() =>
  import('./BadDebtDialogContent').then((m) => ({
    default: m.BadDebtDialogContent,
  })),
);

/**
 * Bad debt dialog.
 */
function BadDebtDialog({ dialogName, payload: { invoiceId = null }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'bad_debt.dialog.bad_debt'} />}
      isOpen={isOpen}
      canEscapeKeyClose={true}
      autoFocus={true}
      className={'dialog--bad-debt'}
    >
      <DialogSuspense>
        <BadDebtDialogContent dialogName={dialogName} invoice={invoiceId} />
      </DialogSuspense>
    </Dialog>
  );
}
export const index = flow(withDialogRedux())(BadDebtDialog);
