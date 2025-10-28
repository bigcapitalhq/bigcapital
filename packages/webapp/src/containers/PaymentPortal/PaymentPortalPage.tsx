import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BodyClassName from 'react-body-classname';
import { PaymentPortal } from './PaymentPortal';
import { PaymentPortalBoot, usePaymentPortalBoot } from './PaymentPortalBoot';
import { PaymentInvoicePreviewDrawer } from './drawers/PaymentInvoicePreviewDrawer/PaymentInvoicePreviewDrawer';
import { DRAWERS } from '@/constants/drawers';
import styles from './PaymentPortal.module.scss';
import { useEffect } from 'react';
import { hsl, lighten, parseToHsl } from 'polished';

export default function PaymentPortalPage() {
  const { linkId } = useParams<{ linkId: string }>();

  return (
    <BodyClassName className={styles.rootBodyPage}>
      <PaymentPortalBoot linkId={linkId}>
        <PaymentPortalHelmet />
        <PaymentPortalCssVariables />
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

/**
 * Renders the dynamic CSS variables for the current payment page.
 * @returns {React.ReactNode}
 */
function PaymentPortalCssVariables() {
  const { sharableLinkMeta } = usePaymentPortalBoot();

  useEffect(() => {
    if (sharableLinkMeta?.brandingTemplate?.primaryColor) {
      const primaryColorHsl = parseToHsl(
        sharableLinkMeta?.brandingTemplate?.primaryColor,
      );
      document.body.style.setProperty(
        '--payment-page-background-color',
        hsl(primaryColorHsl.hue, 0.19, 0.14),
      );
      document.body.style.setProperty(
        '--payment-page-primary-button',
        sharableLinkMeta?.brandingTemplate?.primaryColor,
      );
      document.body.style.setProperty(
        '--payment-page-primary-button-hover',
        lighten(0.05, sharableLinkMeta?.brandingTemplate?.primaryColor),
      );
    }
  }, [sharableLinkMeta?.brandingTemplate?.primaryColor]);

  return null;
}
