import React from 'react';
import { ReceiptMailDialogBoot } from './ReceiptMailDialogBoot';
import { ReceiptMailDialogForm } from './ReceiptMailDialogForm';

interface ReceiptMailDialogContentProps {
  dialogName: string;
  receiptId: number;
  redirectToReceiptsList?: boolean;
}
export default function ReceiptMailDialogContent({
  dialogName,
  receiptId,
  redirectToReceiptsList = false,
}: ReceiptMailDialogContentProps) {
  return (
    <ReceiptMailDialogBoot
      receiptId={receiptId}
      redirectToReceiptsList={redirectToReceiptsList}
    >
      <ReceiptMailDialogForm />
    </ReceiptMailDialogBoot>
  );
}
