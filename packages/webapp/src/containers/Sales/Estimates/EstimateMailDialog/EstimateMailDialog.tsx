// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const EstimateMailDialogContent = React.lazy(
  () => import('./EstimateMailDialogContent'),
);

/**
 * Invoice mail dialog.
 */
function EstimateMailDialog({
  dialogName,
  payload: {
    estimateId = null,

    // Redirect to the estimates list after mail submitting.
    redirectToEstimatesList = false,
  },
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
        <EstimateMailDialogContent
          dialogName={dialogName}
          estimateId={estimateId}
          redirectToEstimatesList={redirectToEstimatesList}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(EstimateMailDialog);
