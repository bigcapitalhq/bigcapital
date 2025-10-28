import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthMetadata } from '@/hooks/query/authentication';

interface OneClickDemoContextType {
  authMeta: any;
}

const OneClickDemoContext = createContext<OneClickDemoContextType>(
  {} as OneClickDemoContextType,
);

export const useOneClickDemoBoot = () => {
  const context = useContext(OneClickDemoContext);

  if (!context) {
    throw new Error(
      'useOneClickDemo must be used within a OneClickDemoProvider',
    );
  }
  return context;
};

interface OneClickDemoBootProps {
  children: ReactNode;
}

export const OneClickDemoBoot: React.FC<OneClickDemoBootProps> = ({
  children,
}) => {
  const { isLoading: isAuthMetaLoading, data: authMeta } = useAuthMetadata();

  const value = {
    isAuthMetaLoading,
    authMeta,
  };

  if (isAuthMetaLoading) {
    return null;
  }
  return (
    <OneClickDemoContext.Provider value={value}>
      {children}
    </OneClickDemoContext.Provider>
  );
};
