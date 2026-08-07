import React, { lazy } from 'react';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { saveInvoke, compose } from '@/utils';

const EstimateNumberDialogContent = lazy(() =>
  import('./EstimateNumberDialogContent').then((m) => ({
    default: m.EstimateNumberDialogContent,
  })),
);

interface EstimateNumberDialogProps {
  dialogName: string;
  payload: { initialFormValues?: Partial<ReferenceNumberFormValues> };
  isOpen: boolean | undefined;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

/**
 * Estimate number dialog.
 */
function EstimateNumberDialog({
  dialogName,
  payload: { initialFormValues },
  isOpen,
  onConfirm,
}: EstimateNumberDialogProps): React.ReactElement {
  const handleConfirm = (values: ReferenceNumberFormValues) => {
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
          // @ts-expect-error — compose()-wrapped component loses generic prop inference.
          initialValues={{ ...initialFormValues }}
          onConfirm={handleConfirm}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(EstimateNumberDialog);
