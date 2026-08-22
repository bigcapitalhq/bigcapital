import React, { createContext, useContext } from 'react';
import type { OrganizationCurrent } from '@bigcapital/sdk-ts';
import { useCurrentOrganization } from '@/hooks/query';

export const OrganizationMetaContext = createContext<
  OrganizationCurrent['metadata'] | undefined
>(undefined);

interface OrganizationMetaProviderProps {
  /**
   * Optional metadata value. When provided, the organization query is not
   * executed and the given value is used as-is.
   */
  value?: OrganizationCurrent['metadata'];
  children?: React.ReactNode;
}

/**
 * Provides the current organization metadata down the tree. Accepts an
 * optional `value` to be used without firing the organization query.
 */
export function OrganizationMetaProvider({
  value,
  children,
}: OrganizationMetaProviderProps) {
  return value != null ? (
    <OrganizationMetaContext.Provider value={value}>
      {children}
    </OrganizationMetaContext.Provider>
  ) : (
    <OrganizationMetaQueryProvider>{children}</OrganizationMetaQueryProvider>
  );
}

/**
 * Injects the current organization metadata from the shared organization query.
 */
function OrganizationMetaQueryProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { data } = useCurrentOrganization();

  return (
    <OrganizationMetaContext.Provider value={data?.metadata}>
      {children}
    </OrganizationMetaContext.Provider>
  );
}

/**
 * Retrieves the current organization metadata from the nearest provider,
 * or `undefined` when used outside of it.
 */
export function useOrganizationMeta() {
  return useContext(OrganizationMetaContext);
}
