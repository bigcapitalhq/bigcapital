import * as FF from 'fp-ts/function';
import React from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const SharePaymentLinkContent = React.lazy(() =>
  import('./SharePaymentLinkContent').then((module) => ({
    default: module.SharePaymentLinkContent,
  })),
);

interface SharePaymentLinkDialogProps extends DialogBaseProps {
  dialogName: string;
}

/**
 *
 */
function SharePaymentLinkDialogRoot({
  dialogName,
  payload,
  isOpen,
}: SharePaymentLinkDialogProps) {
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

export const SharePaymentLinkDialog = FF.pipe(
  SharePaymentLinkDialogRoot,
  withDialogRedux(),
);

SharePaymentLinkDialog.displayName = 'SharePaymentLinkDialog';
