import { DRAWERS } from '@/constants/drawers';
import { index as PaymentMadeDetailDrawer } from '@/containers/Drawers/PaymentMadeDetailDrawer';

export function PaymentMadeListDrawers() {
  return (
    <>
      <PaymentMadeDetailDrawer name={DRAWERS.PAYMENT_MADE_DETAILS} />
    </>
  );
}
