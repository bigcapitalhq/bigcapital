import React, { createContext, ReactNode, useContext } from 'react';

// The resource type value from RESOURCES_TYPES constant
type ResourceType = string;

// Search type option item
interface SearchTypeOption {
  key: ResourceType;
  label: string;
}

// Context value type
interface UniversalSearchContextValue {
  /** Whether the search is loading */
  isLoading: boolean;
  /** Current search type/resource type */
  searchType: ResourceType;
  /** Default search resource type */
  defaultSearchResource?: ResourceType;
  /** List of available search type options */
  searchTypeOptions: SearchTypeOption[];
}

// Create the context with undefined as initial value
const UniversalSearchContext = createContext<
  UniversalSearchContextValue | undefined
>(undefined);

// Provider props interface
interface UniversalSearchProviderProps {
  /** Whether the search is loading */
  isLoading: boolean;
  /** Default search resource type */
  defaultSearchResource?: ResourceType;
  /** Current search type/resource type */
  searchType: ResourceType;
  /** List of available search type options */
  searchTypeOptions: SearchTypeOption[];
  /** Child elements */
  children: ReactNode;
}

/**
 * Universal search data provider.
 */
export function UniversalSearchProvider({
  isLoading,
  defaultSearchResource,
  searchType,
  searchTypeOptions,
  children,
}: UniversalSearchProviderProps) {
  // Provider payload.
  const provider: UniversalSearchContextValue = {
    isLoading,
    searchType,
    defaultSearchResource,
    searchTypeOptions,
  };

  return (
    <UniversalSearchContext.Provider value={provider}>
      {children}
    </UniversalSearchContext.Provider>
  );
}

/**
 * Hook to access the universal search context.
 * @throws Error if used outside of UniversalSearchProvider
 */
export const useUniversalSearchContext = (): UniversalSearchContextValue => {
  const context = useContext(UniversalSearchContext);

  if (context === undefined) {
    throw new Error(
      'useUniversalSearchContext must be used within a UniversalSearchProvider',
    );
  }

  return context;
};
