// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ConnectBankDialogBody = React.lazy(
  () => import('./ConnectBankDialogBody'),
);

/**
 * Connect bank dialog.
 */
function ConnectBankDialogRoot({ dialogName, payload = {}, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={'Securly connect your bank or credit card.'}
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
    >
      <DialogSuspense>
        <ConnectBankDialogBody dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const ConnectBankDialog = compose(withDialogRedux())(
  ConnectBankDialogRoot,
);
