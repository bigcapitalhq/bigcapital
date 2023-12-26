import React from 'react';
import { ReceiptMailDialogBoot } from './ReceiptMailDialogBoot';
import { ReceiptMailDialogForm } from './ReceiptMailDialogForm';

interface ReceiptMailDialogContentProps {
  dialogName: string
  receiptId: number;
}
export default function ReceiptMailDialogContent({
  dialogName,
  receiptId,
}: ReceiptMailDialogContentProps) {
  return (
    <ReceiptMailDialogBoot receiptId={receiptId}>
      <ReceiptMailDialogForm />
    </ReceiptMailDialogBoot>
  );
}
