// @ts-nocheck
import React, { createContext } from 'react';
import { useSaleReceiptDefaultOptions } from '@/hooks/query';
import { DialogContent } from '@/components';

interface ReceiptMailDialogBootValues {
  receiptId: number;
  mailOptions: any;
}

const ReceiptMailDialogBootContext =
  createContext<ReceiptMailDialogBootValues>();

interface ReceiptMailDialogBootProps {
  receiptId: number;
  children: React.ReactNode;
}

/**
 * Receipt mail dialog boot provider.
 */
function ReceiptMailDialogBoot({
  receiptId,
  ...props
}: ReceiptMailDialogBootProps) {
  const { data: mailOptions, isLoading: isMailOptionsLoading } =
    useSaleReceiptDefaultOptions(receiptId);

  const provider = {
    saleReceiptId: receiptId,
    mailOptions,
    isMailOptionsLoading,
  };

  return (
    <DialogContent isLoading={isMailOptionsLoading}>
      <ReceiptMailDialogBootContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useReceiptMailDialogBoot = () =>
  React.useContext<ReceiptMailDialogBootValues>(ReceiptMailDialogBootContext);

export { ReceiptMailDialogBoot, useReceiptMailDialogBoot };
