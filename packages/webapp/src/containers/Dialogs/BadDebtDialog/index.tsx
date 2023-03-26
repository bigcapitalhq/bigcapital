// @ts-nocheck
import React from 'react';

import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from 'redux';

const BadDebtDialogContent = React.lazy(() => import('./BadDebtDialogContent'));

/**
 * Bad debt dialog.
 */
function BadDebtDialog({ dialogName, payload: { invoiceId = null }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'bad_debt.dialog.bad_debt'} />}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--bad-debt'}
    >
      <DialogSuspense>
        <BadDebtDialogContent dialogName={dialogName} invoice={invoiceId} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(BadDebtDialog);
