import React from 'react';
import {Dialog, Spinner, Classes} from '@blueprintjs/core';

export default function DialogComponent(props) {
  const loadingContent = (
    <div className={Classes.DIALOG_BODY}><Spinner size={30} /></div>
  );
  return (
    <Dialog {...props}>
      {props.isLoading ? loadingContent : props.children}
    </Dialog>
  );
}