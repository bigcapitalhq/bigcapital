import React from 'react';
import { ReceiptMailDialogBoot } from './ReceiptMailDialogBoot';
import { ReceiptMailDialogForm } from './ReceiptMailDialogForm';

export interface ReceiptMailDialogContentProps {
  receiptId: number;
  onFormSubmit?: () => void;
  onCancelClick?: () => void;
}
export default function ReceiptMailDialogContent({
  receiptId,
  onFormSubmit,
  onCancelClick
}: ReceiptMailDialogContentProps) {
  return (
    <ReceiptMailDialogBoot receiptId={receiptId}>
      <ReceiptMailDialogForm
        onFormSubmit={onFormSubmit}
        onCancelClick={onCancelClick}
      />
    </ReceiptMailDialogBoot>
  );
}
