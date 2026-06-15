// @ts-nocheck
import React from 'react';
import { Dialog } from '@blueprintjs/core';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

import '@/style/components/Dialog/Dialog.scss';
import { DialogProvider } from './DialogProvider';
import { flow } from 'fp-ts/function';

function DialogComponent(props) {
  const { name, children, closeDialog, onClose } = props;

  const handleClose = (event) => {
    closeDialog(name);
    onClose && onClose(event);
  };
  return (
    <Dialog {...props} onClose={handleClose}>
      <DialogProvider value={props}>{children}</DialogProvider>
    </Dialog>
  );
}

const DialogRoot = flow(withDialogActions)(DialogComponent);

export { DialogRoot as Dialog };
