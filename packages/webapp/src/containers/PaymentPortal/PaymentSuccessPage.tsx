import { useParams } from 'react-router-dom';
import { Callout, Intent } from '@blueprintjs/core';

import PaymentPortalPage from './PaymentPortalPage';
import { PaymentPortalBoot } from './PaymentPortalBoot';
import { Stack } from '@/components';
import { PaymentPortalInvoiceHeader } from './PaymentPortalInvoiceHeader';
import styles from './PaymentPortal.module.scss';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';

function PaymentSuccessPage() {
  return (
    <PaymentPortalPage>
      <Stack spacing={0} className={styles.body}>
        <Stack>
          <PaymentPortalInvoiceHeader />
          <Callout intent={Intent.SUCCESS} title="Payment Successful">
            Thank you. Your payment was successfully received.
          </Callout>
          <DownloadInvoiceButton />
        </Stack>
      </Stack>
    </PaymentPortalPage>
  );
}

export default function PaymentSuccessPageWrapper() {
  const { linkId } = useParams<{ linkId: string }>();

  return (
    <PaymentPortalBoot linkId={linkId}>
      <PaymentSuccessPage />
    </PaymentPortalBoot>
  );
}
