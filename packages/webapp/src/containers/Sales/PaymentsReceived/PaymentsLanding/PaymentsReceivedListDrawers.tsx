import { DRAWERS } from '@/constants/drawers';
import { index as PaymentReceiveDetailDrawer } from '@/containers/Drawers/PaymentReceiveDetailDrawer';
import { PaymentReceivedSendMailDrawer } from '@/containers/Sales/PaymentsReceived/PaymentReceivedMailDrawer';

export function PaymentsReceivedListDrawers() {
  return (
    <>
      <PaymentReceiveDetailDrawer name={DRAWERS.PAYMENT_RECEIVED_DETAILS} />
      <PaymentReceivedSendMailDrawer
        name={DRAWERS.PAYMENT_RECEIVED_SEND_MAIL}
      />
    </>
  );
}
