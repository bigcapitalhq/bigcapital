// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke } from '@/utils';
import { flow } from 'fp-ts/function';

const EstimateNumberDialogContent = lazy(() =>
  import('./EstimateNumberDialogContent').then((m) => ({
    default: m.EstimateNumberDialogContent,
  })),
);

/**
 * Estimate number dialog.
 */
function EstimateNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}) {
  const handleConfirm = (values) => {
    saveInvoke(onConfirm, values);
  };

  return (
    <Dialog
      name={dialogName}
      title={<T id={'Estimate_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--journal-number-settings'}
    >
      <DialogSuspense>
        <EstimateNumberDialogContent
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = flow(withDialogRedux())(EstimateNumberDialog);
