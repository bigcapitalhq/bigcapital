// @ts-nocheck
import React, { Suspense } from 'react';
import { DrawerLoading } from '@/components';

/**
 * Loading content.
 */
function LoadingContent() {
  return <DrawerLoading loading={true} />;
}

export function DrawerSuspense({ children }) {
  return <Suspense fallback={<LoadingContent />}>{children}</Suspense>;
}
