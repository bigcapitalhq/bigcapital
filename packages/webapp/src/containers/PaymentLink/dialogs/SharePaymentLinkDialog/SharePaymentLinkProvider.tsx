import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SharePaymentLinkContextType {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}

const SharePaymentLinkContext =
  createContext<SharePaymentLinkContextType | null>(null);

interface SharePaymentLinkProviderProps {
  children: ReactNode;
}

export const SharePaymentLinkProvider: React.FC<
  SharePaymentLinkProviderProps
> = ({ children }) => {
  const [url, setUrl] = useState<string>('');

  return (
    <SharePaymentLinkContext.Provider value={{ url, setUrl }}>
      {children}
    </SharePaymentLinkContext.Provider>
  );
};

export const useSharePaymentLink = () => {
  const context = useContext(SharePaymentLinkContext);
  if (!context) {
    throw new Error(
      'useSharePaymentLink must be used within a SharePaymentLinkProvider',
    );
  }
  return context;
};
