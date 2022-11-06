// @ts-nocheck
import React, { createContext } from 'react';

const UniversalSearchContext = createContext();

/**
 * Universal search data provider.
 */
function UniversalSearchProvider({
  isLoading,
  defaultSearchResource,
  searchType,
  searchTypeOptions,
  ...props
}) {
  // Provider payload.
  const provider = {
    isLoading,
    searchType,
    defaultSearchResource,
    searchTypeOptions,
  };

  return <UniversalSearchContext.Provider value={provider} {...props} />;
}

const useUniversalSearchContext = () =>
  React.useContext(UniversalSearchContext);

export { UniversalSearchProvider, useUniversalSearchContext };
