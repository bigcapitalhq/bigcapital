// @ts-nocheck
import React from 'react';
import { Dialog } from '@blueprintjs/core';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

import '@/style/components/Dialog/Dialog.scss';

function DialogComponent(props) {
  const { name, children, closeDialog, onClose } = props;

  const handleClose = (event) => {
    closeDialog(name);
    onClose && onClose(event);
  };
  return (
    <Dialog {...props} onClose={handleClose}>
      {children}
    </Dialog>
  );
}

const DialogRoot = compose(withDialogActions)(DialogComponent);

export { DialogRoot as Dialog };
