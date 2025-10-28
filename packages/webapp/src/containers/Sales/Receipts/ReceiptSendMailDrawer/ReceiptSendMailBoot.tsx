// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { Spinner } from '@blueprintjs/core';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import {
  GetSaleReceiptMailStateResponse,
  useSaleReceiptMailState,
} from '@/hooks/query';

interface ReceiptSendMailBootValues {
  receiptId: number;

  receiptMailState: GetSaleReceiptMailStateResponse | null;
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
  const { data: receiptMailState, isLoading: isReceiptMailState } =
    useSaleReceiptMailState(receiptId);

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
