import { useParams } from 'react-router-dom';
import { PaymentPortal } from './PaymentPortal';
import { PaymentPortalBoot } from './PaymentPortalBoot';
import BodyClassName from 'react-body-classname';
import styles from './PaymentPortal.module.scss';
import { PaymentInvoicePreviewDrawer } from './drawers/PaymentInvoicePreviewDrawer/PaymentInvoicePreviewDrawer';
import { DRAWERS } from '@/constants/drawers';

export default function PaymentPortalPage() {
  const { linkId } = useParams<{ linkId: string }>();

  return (
    <BodyClassName className={styles.rootBodyPage}>
      <PaymentPortalBoot linkId={linkId}>
        <PaymentPortal />
        <PaymentInvoicePreviewDrawer name={DRAWERS.PAYMENT_INVOICE_PREVIEW} />
      </PaymentPortalBoot>
    </BodyClassName>
  );
}
