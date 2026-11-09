// @ts-nocheck
import { Classes, Spinner } from '@blueprintjs/core';
import React, { Suspense } from 'react';

function LoadingContent() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <Spinner size={30} />
    </div>
  );
}

interface DialogSuspenseProps {
  children?: React.ReactNode;
  testId?: string;
}

export function DialogSuspense({ children, testId }: DialogSuspenseProps) {
  return (
    <Suspense fallback={<LoadingContent />}>
      <div className={'dialog__suspense-wrapper'} data-testId={testId}>
        {children}
      </div>
    </Suspense>
  );
}
