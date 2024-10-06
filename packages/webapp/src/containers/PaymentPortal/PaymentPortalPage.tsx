import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BodyClassName from 'react-body-classname';
import { PaymentPortal } from './PaymentPortal';
import { PaymentPortalBoot, usePaymentPortalBoot } from './PaymentPortalBoot';
import { PaymentInvoicePreviewDrawer } from './drawers/PaymentInvoicePreviewDrawer/PaymentInvoicePreviewDrawer';
import { DRAWERS } from '@/constants/drawers';
import styles from './PaymentPortal.module.scss';

export default function PaymentPortalPage() {
  const { linkId } = useParams<{ linkId: string }>();

  return (
    <BodyClassName className={styles.rootBodyPage}>
      <PaymentPortalBoot linkId={linkId}>
        <PaymentPortalHelmet />
        <PaymentPortal />
        <PaymentInvoicePreviewDrawer name={DRAWERS.PAYMENT_INVOICE_PREVIEW} />
      </PaymentPortalBoot>
    </BodyClassName>
  );
}

/**
 * Renders the document title of the current payment page.
 * @returns {React.ReactNode}
 */
function PaymentPortalHelmet() {
  const { sharableLinkMeta } = usePaymentPortalBoot();

  return (
    <Helmet>
      <title>
        {sharableLinkMeta?.invoiceNo} | {sharableLinkMeta?.organization?.name}
      </title>
    </Helmet>
  );
}
