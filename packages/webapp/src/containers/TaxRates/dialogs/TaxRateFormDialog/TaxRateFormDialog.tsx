import React, { lazy } from 'react';
import styled from 'styled-components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux, {
  DialogBaseProps,
} from '@/components/DialogReduxConnect';
import { flow } from 'fp-ts/function';

const TaxRateFormDialogContent = lazy(() =>
  import('./TaxRateFormDialogContent').then((m) => ({
    default: m.TaxRateFormDialogContent,
  })),
);

interface TaxRateFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: { action: string; id?: number };
}

function TaxRateFormDialogInner({
  dialogName,
  payload = { action: '' },
  isOpen,
}: TaxRateFormDialogProps) {
  return (
    <TaxRateDialog
      name={dialogName}
      title={payload.id ? 'Edit Tax Rate' : 'Create Tax Rate'}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <TaxRateFormDialogContent
          dialogName={dialogName}
          taxRateId={payload.id as number}
        />
      </DialogSuspense>
    </TaxRateDialog>
  );
}

const TaxRateDialog = styled(Dialog)`
  max-width: 450px;
`;

export const TaxRateFormDialog = flow(withDialogRedux())(
  TaxRateFormDialogInner,
);
