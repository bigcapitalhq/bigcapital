// @ts-nocheck
import React, { Suspense } from 'react';
import { Classes, Spinner } from '@blueprintjs/core';

function LoadingContent() {
  return (<div className={Classes.DIALOG_BODY}><Spinner size={30} /></div>);
}

export function DialogSuspense({
  children
}) {
  return (
    <Suspense fallback={<LoadingContent /> }>
      <div className={'dialog__suspense-wrapper'}>
        { children }
      </div>
    </Suspense>
  );
};