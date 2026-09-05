// @ts-nocheck
import { Dialog } from '@blueprintjs/core';
import React from 'react';
import { DialogProvider } from './DialogProvider';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import '@/style/components/Dialog/Dialog.scss';
import { compose } from '@/utils';

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

const DialogRoot = compose(withDialogActions)(DialogComponent);

export { DialogRoot as Dialog };
