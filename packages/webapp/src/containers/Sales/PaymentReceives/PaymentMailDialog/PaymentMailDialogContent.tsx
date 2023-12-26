import { PaymentMailDialogBoot } from './PaymentMailDialogBoot';
import { PaymentMailDialogForm } from './PaymentMailDialogForm';

interface PaymentMailDialogContentProps {
  dialogName: string;
  paymentReceiveId: number;
}
export default function PaymentMailDialogContent({
  dialogName,
  paymentReceiveId,
}: PaymentMailDialogContentProps) {
  return (
    <PaymentMailDialogBoot paymentReceiveId={paymentReceiveId}>
      <PaymentMailDialogForm />
    </PaymentMailDialogBoot>
  );
}
