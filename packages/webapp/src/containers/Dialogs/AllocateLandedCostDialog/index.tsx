import React, { lazy } from 'react';
import type { AllocateLandedCostDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { FormattedMessage as T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const AllocateLandedCostDialogContent = lazy(() =>
  import('./AllocateLandedCostDialogContent').then((m) => ({
    default: m.AllocateLandedCostDialogContent,
  })),
);

interface AllocateLandedCostDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: AllocateLandedCostDialogPayload;
}

/**
 * Allocate landed cost dialog.
 */
function AllocateLandedCostDialog({
  dialogName,
  payload: { billId } = { billId: null },
  isOpen,
}: AllocateLandedCostDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'allocate_landed_coast'} />}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className="dialog--allocate-landed-cost-form"
    >
      <DialogSuspense>
        <AllocateLandedCostDialogContent
          billId={billId ?? null}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(AllocateLandedCostDialog);
