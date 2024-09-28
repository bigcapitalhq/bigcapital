import { useCurrentOrganization } from '@/hooks/query';
import React, { createContext, useContext, ReactNode } from 'react';

interface PreferencesBrandingContextType {
  isOrganizationLoading: boolean;
  organization: any;
}

const PreferencesBrandingContext =
  createContext<PreferencesBrandingContextType>(
    {} as PreferencesBrandingContextType,
  );

interface PreferencesBrandingProviderProps {
  children: ReactNode;
}

export const PreferencesBrandingBoot: React.FC<
  PreferencesBrandingProviderProps
> = ({ children }) => {
  // Fetches current organization information.
  const { isLoading: isOrganizationLoading, data: organization } =
    useCurrentOrganization({});

  const contextValue: PreferencesBrandingContextType = {
    isOrganizationLoading,
    organization,
  };

  return (
    <PreferencesBrandingContext.Provider value={contextValue}>
      {children}
    </PreferencesBrandingContext.Provider>
  );
};

export const usePreferencesBrandingBoot = () => {
  const context = useContext(PreferencesBrandingContext);

  if (context === undefined) {
    throw new Error(
      'usePreferencesBranding must be used within a PreferencesBrandingProvider',
    );
  }
  return context;
};
