import React, { Suspense } from 'react';
import { Spinner, Classes } from '@blueprintjs/core';

function LoadingContent() {
  return (
    <div className={Classes.DRAWER_BODY}>
      <Spinner size={30} />
    </div>
  );
}

export default function DrawerSuspense({ children }) {
  return <Suspense fallback={<LoadingContent />}>{children}</Suspense>;
}
