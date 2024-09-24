// @ts-nocheck
import React from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const SharePaymentLinkContent = React.lazy(() =>
  import('./SharePaymentLinkContent').then((module) => ({
    default: module.SharePaymentLinkContent,
  })),
);

/**
 * 
 */
function SharePaymentLinkDialogRoot({ dialogName, payload, isOpen }) {
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
        <SharePaymentLinkContent />
      </DialogSuspense>
    </Dialog>
  );
}

export const SharePaymentLinkDialog = compose(withDialogRedux())(
  SharePaymentLinkDialogRoot,
);

SharePaymentLinkDialog.displayName = 'SharePaymentLinkDialog';
