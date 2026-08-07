import React, { lazy } from 'react';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke, compose } from '@/utils';

const PaymentReceiveNumbereDialogContent = lazy(() =>
  import('./PaymentReceiveNumberDialogContent').then((m) => ({
    default: m.PaymentReceiveNumberDialogContent,
  })),
);

interface PaymentReceiveNumberDialogProps {
  dialogName: string;
  payload: { initialFormValues?: Partial<ReferenceNumberFormValues> };
  isOpen: boolean | undefined;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Payment receive number dialog.
 */
function PaymentReceiveNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}: PaymentReceiveNumberDialogProps): React.ReactElement {
  return (
    <Dialog
      title={<T id={'payment_number_settings'} />}
      name={dialogName}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <PaymentReceiveNumbereDialogContent
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          initialValues={initialFormValues}
          onConfirm={(values: ReferenceNumberFormValues) =>
            saveInvoke(onConfirm, values)
          }
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(PaymentReceiveNumberDialog);
