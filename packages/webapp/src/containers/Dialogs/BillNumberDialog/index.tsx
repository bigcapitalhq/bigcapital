import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const BillNumberDialogContent = lazy(() =>
  import('./BillNumberDialogContent').then((m) => ({
    default: m.BillNumberDialogContent,
  })),
);

interface BillNumberDialogProps {
  dialogName: string;
  payload?: { id?: number | null; [key: string]: unknown };
  isOpen: boolean | undefined;
}

function BillNumberDialog({
  dialogName,
  payload = { id: null },
  isOpen,
}: BillNumberDialogProps): React.ReactElement {
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
        <BillNumberDialogContent
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          billNumberId={payload.id}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(BillNumberDialog);
