import { Spinner } from '@blueprintjs/core';
import React, { createContext, useContext } from 'react';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useSaleReceiptMailState } from '@/hooks/query';

interface ReceiptSendMailState {
  from: string[];
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  message: string;
  formatArgs?: Record<string, string>;
  toOptions: Array<{ label: string; mail: string; primary?: boolean }>;
  fromOptions: Array<{ label: string; mail: string; primary?: boolean }>;
  attachPdf?: boolean;
  receiptNumber: string;
  total: number;
  totalFormatted: string;
  subtotal: number;
  subtotalFormatted: string;
  discount: number;
  discountAmountFormatted: string;
  adjustment: number;
  adjustmentFormatted: string;
  companyName: string;
  companyLogoUri: string | null;
  primaryColor: string | null;
  customerName: string;
  entries: Array<{ name: string; quantity: number; totalFormatted: string }>;
}

interface ReceiptSendMailBootValues {
  receiptId: number;

  receiptMailState: ReceiptSendMailState | undefined;
  isReceiptMailState: boolean;
}
interface ReceiptSendMailBootProps {
  children: React.ReactNode;
}

const ReceiptSendMailContentBootContext =
  createContext<ReceiptSendMailBootValues>({} as ReceiptSendMailBootValues);

export const ReceiptSendMailBoot = ({ children }: ReceiptSendMailBootProps) => {
  const {
    payload: { receiptId },
  } = useDrawerContext();

  // Receipt mail options.
  const { data, isLoading: isReceiptMailState } =
    useSaleReceiptMailState(receiptId);
  const receiptMailState = data as ReceiptSendMailState | undefined;

  const isLoading = isReceiptMailState;

  if (isLoading) {
    return <Spinner size={20} />;
  }
  const value = {
    receiptId,

    // # Receipt mail options
    isReceiptMailState,
    receiptMailState,
  };

  return (
    <ReceiptSendMailContentBootContext.Provider value={value}>
      {children}
    </ReceiptSendMailContentBootContext.Provider>
  );
};
ReceiptSendMailBoot.displayName = 'ReceiptSendMailBoot';

export const useReceiptSendMailBoot = () => {
  return useContext<ReceiptSendMailBootValues>(
    ReceiptSendMailContentBootContext,
  );
};
