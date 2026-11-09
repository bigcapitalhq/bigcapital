// @ts-nocheck
import { Dialog } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { DialogProvider } from './DialogProvider';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import '@/style/components/Dialog/Dialog.scss';

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

const DialogRoot = FF.pipe(DialogComponent, withDialogActions);

export { DialogRoot as Dialog };
