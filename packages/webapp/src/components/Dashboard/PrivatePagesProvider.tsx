import React from 'react';
import { useApplicationBoot } from '@/components';
import { useAuthMetadata } from '@/hooks/query/authentication';

interface PrivatePagesProviderProps {
  children?: React.ReactNode;
}

/**
 * Private pages provider.
 */
export function PrivatePagesProvider({ children }: PrivatePagesProviderProps) {
  const { isLoading: isAppBootLoading } = useApplicationBoot();
  const { isLoading: isAuthMetaLoading } = useAuthMetadata();

  const isLoading = isAppBootLoading || isAuthMetaLoading;

  return <React.Fragment>{!isLoading ? children : null}</React.Fragment>;
}
