// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const EstimateMailDialogBody = React.lazy(
  () => import('./EstimateMailDialogBody'),
);

/**
 * Estimate mail dialog.
 */
function EstimateMailDialog({
  dialogName,
  payload: { estimateId = null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={'Estimate Mail'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      style={{ width: 600 }}
    >
      <DialogSuspense>
        <EstimateMailDialogBody estimateId={estimateId} />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(EstimateMailDialog);
