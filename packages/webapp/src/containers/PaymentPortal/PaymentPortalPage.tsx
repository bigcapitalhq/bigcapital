import { useParams } from 'react-router-dom';
import { PaymentPortal } from './PaymentPortal';
import { PaymentPortalBoot } from './PaymentPortalBoot';

export default function PaymentPortalPage() {
  const { linkId } = useParams<{ linkId: string}>();

  return (
    <PaymentPortalBoot linkId={linkId}>
      <PaymentPortal />
    </PaymentPortalBoot>
  );
}
