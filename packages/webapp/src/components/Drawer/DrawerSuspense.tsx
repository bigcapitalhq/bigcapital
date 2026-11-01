import React, { Suspense } from 'react';
import { DrawerLoading } from '@/components';

export interface DrawerSuspenseProps {
  children?: React.ReactNode;
}

/**
 * Loading content.
 */
function LoadingContent() {
  return <DrawerLoading loading={true} />;
}

export function DrawerSuspense({ children }: DrawerSuspenseProps) {
  return <Suspense fallback={<LoadingContent />}>{children}</Suspense>;
}
