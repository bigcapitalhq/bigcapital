import { Helmet } from 'react-helmet';
import BodyClassName from 'react-body-classname';
import styles from './PaymentPortal.module.scss';
import { ReactNode, useEffect } from 'react';
import { hsl, lighten, parseToHsl } from 'polished';
import { Box } from '@/components';
import { usePaymentPortalBoot } from './PaymentPortalBoot';

export default function PaymentPortalPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <BodyClassName className={styles.rootBodyPage}>
      <>
        <PaymentPortalHelmet />
        <PaymentPortalCssVariables />
        <Box className={styles.root} my={'40px'} mx={'auto'}>
          {children}
        </Box>
      </>
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
