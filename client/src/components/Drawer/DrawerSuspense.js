import React, { Suspense } from 'react';
import { Spinner } from '@blueprintjs/core';

export default function DrawerSuspense({ children }) {
  return <Suspense fallback={<Spinner size={30} />}>{children}</Suspense>;
}
