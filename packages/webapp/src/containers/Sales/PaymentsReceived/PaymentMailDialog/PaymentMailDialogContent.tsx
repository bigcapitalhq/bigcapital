import { PaymentMailDialogBoot } from './PaymentMailDialogBoot';
import { PaymentMailDialogForm } from './PaymentMailDialogForm';

interface PaymentMailDialogContentProps {
  dialogName: string;
  paymentReceiveId: number;
  redirectToPaymentsList: boolean;
}
export default function PaymentMailDialogContent({
  dialogName,
  paymentReceiveId,
  redirectToPaymentsList,
}: PaymentMailDialogContentProps) {
  return (
    <PaymentMailDialogBoot
      paymentReceiveId={paymentReceiveId}
      redirectToPaymentsList={redirectToPaymentsList}
    >
      <PaymentMailDialogForm />
    </PaymentMailDialogBoot>
  );
}
