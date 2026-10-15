import * as FF from 'fp-ts/function';
import React from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const SelectPaymentMethodsDialogContent = React.lazy(() =>
  import('./SelectPaymentMethodsContent').then((module) => ({
    default: module.SelectPaymentMethodsContent,
  })),
);

interface SelectPaymentMethodsDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 * Select payment methods dialogs.
 */
function SelectPaymentMethodsDialogRoot({
  dialogName,
  payload,
  isOpen,
}: SelectPaymentMethodsDialogProps) {
  return (
    <Dialog
      name={dialogName}
      isOpen={isOpen}
      payload={payload}
      title={'Share Link'}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 570 }}
    >
      <DialogSuspense>
        <SelectPaymentMethodsDialogContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const SelectPaymentMethodsDialog = FF.pipe(
  SelectPaymentMethodsDialogRoot,
  withDialogRedux(),
);

SelectPaymentMethodsDialog.displayName = 'SelectPaymentMethodsDialog';
