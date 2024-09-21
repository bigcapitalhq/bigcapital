import React, { createContext, useContext, ReactNode } from 'react';
import {
  GetInvoicePaymentLinkResponse,
  useGetInvoicePaymentLink,
} from '@/hooks/query/payment-link';
import { Spinner } from '@blueprintjs/core';

interface PaymentPortalContextType {
  linkId: string;
  sharableLinkMeta: GetInvoicePaymentLinkResponse | undefined;
  isSharableLinkMetaLoading: boolean;
}

const PaymentPortalContext = createContext<PaymentPortalContextType>(
  {} as PaymentPortalContextType,
);

interface PaymentPortalBootProps {
  linkId: string;
  children: ReactNode;
}

export const PaymentPortalBoot: React.FC<PaymentPortalBootProps> = ({
  linkId,
  children,
}) => {
  const { data: sharableLinkMeta, isLoading: isSharableLinkMetaLoading } =
    useGetInvoicePaymentLink(linkId);

  const value = {
    linkId,
    sharableLinkMeta,
    isSharableLinkMetaLoading,
  };
  if (isSharableLinkMetaLoading) {
    return <Spinner size={20} />;
  }

  return (
    <PaymentPortalContext.Provider value={value}>
      {children}
    </PaymentPortalContext.Provider>
  );
};

export const usePaymentPortalBoot = (): PaymentPortalContextType => {
  const context = useContext(PaymentPortalContext);

  if (!context) {
    throw new Error(
      'usePaymentPortal must be used within a PaymentPortalProvider',
    );
  }
  return context;
};
