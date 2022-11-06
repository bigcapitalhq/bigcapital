// @ts-nocheck
import React from 'react';
import { useApplicationBoot } from '@/components';

/**
 * Private pages provider.
 */
export function PrivatePagesProvider({
  // #ownProps
  children,
}) {
  const { isLoading } = useApplicationBoot();

  return <React.Fragment>{!isLoading ? children : null}</React.Fragment>;
}
