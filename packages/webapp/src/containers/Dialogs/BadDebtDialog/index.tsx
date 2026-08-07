import React from 'react';
import { compose } from 'redux';
import type { BadDebtDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const BadDebtDialogContent = React.lazy(() =>
  import('./BadDebtDialogContent').then((m) => ({
    default: m.BadDebtDialogContent,
  })),
);

interface BadDebtDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: BadDebtDialogPayload;
}

/**
 * Bad debt dialog.
 */
function BadDebtDialog({
  dialogName,
  payload: { invoiceId = null } = {},
  isOpen,
}: BadDebtDialogProps): React.ReactElement {
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
export const index = compose(withDialogRedux())(BadDebtDialog);
