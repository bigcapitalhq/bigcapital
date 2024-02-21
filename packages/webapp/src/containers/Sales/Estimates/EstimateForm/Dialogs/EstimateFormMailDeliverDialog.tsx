// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const EstimateFormMailDeliverDialogContent = React.lazy(
  () => import('./EstimateFormMailDeliverDialogContent'),
);

/**
 * Estimate mail dialog.
 */
function EstimateFormMailDeliverDialog({
  dialogName,
  payload: { estimateId = null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={'Estimate Mail'}
      isOpen={isOpen}
      canEscapeJeyClose={false}
      isCloseButtonShown={false}
      autoFocus={true}
      style={{ width: 600 }}
    >
      <DialogSuspense>
        <EstimateFormMailDeliverDialogContent
          dialogName={dialogName}
          estimateId={estimateId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(EstimateFormMailDeliverDialog);
