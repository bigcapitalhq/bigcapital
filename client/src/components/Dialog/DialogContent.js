import React from 'react';
import { Spinner, Classes } from '@blueprintjs/core';

export default function DialogContent(props) {
  const { isLoading, children } = props;

  const loadingContent = (
    <div className={Classes.DIALOG_BODY}><Spinner size={30} /></div>
  );
  return (
    <div>
      {isLoading ? loadingContent : children}
    </div>
  );
}