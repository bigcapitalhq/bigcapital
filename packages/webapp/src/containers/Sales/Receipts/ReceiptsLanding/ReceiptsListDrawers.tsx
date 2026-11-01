import { DRAWERS } from '@/constants/drawers';
import { index as ReceiptDetailDrawer } from '@/containers/Drawers/ReceiptDetailDrawer';
import { ReceiptSendMailDrawer } from '@/containers/Sales/Receipts/ReceiptSendMailDrawer';

export function ReceiptsListDrawers() {
  return (
    <>
      <ReceiptDetailDrawer name={DRAWERS.RECEIPT_DETAILS} />
      <ReceiptSendMailDrawer name={DRAWERS.RECEIPT_SEND_MAIL} />
    </>
  );
}
