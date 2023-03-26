// @ts-nocheck
import React, { lazy } from 'react';
import { FormattedMessage as T, Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const AllocateLandedCostDialogContent = lazy(() =>
  import('./AllocateLandedCostDialogContent'),
);

/**
 * Allocate landed cost dialog.
 */
function AllocateLandedCostDialog({
  dialogName,
  payload = { billId: null },
  isOpen,
}) {
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
          billId={payload.billId}
          dialogName={dialogName}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(AllocateLandedCostDialog);
