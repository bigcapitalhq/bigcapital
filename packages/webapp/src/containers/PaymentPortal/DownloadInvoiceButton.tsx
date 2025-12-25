import { Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { AppToaster } from '@/components';
import { useGeneratePaymentLinkInvoicePdf } from '@/hooks/query/payment-link';
import { usePaymentPortalBoot } from './PaymentPortalBoot';
import { downloadFile } from '@/hooks/useDownloadFile';
import styles from './PaymentPortal.module.scss';

export function DownloadInvoiceButton() {
  const { sharableLinkMeta, linkId } = usePaymentPortalBoot();
  const {
    mutateAsync: generatePaymentLinkInvoice,
    isLoading: isInvoiceGenerating,
  } = useGeneratePaymentLinkInvoicePdf();

  // Handles invoice download button click.
  function onClick() {
    generatePaymentLinkInvoice({ paymentLinkId: linkId })
      .then((data) => {
        downloadFile(
          data,
          `Invoice ${sharableLinkMeta?.invoiceNo}`,
          'application/pdf',
        );
      })
      .catch(() => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  }

  return (
    <Button
      minimal
      className={clsx(styles.footerButton, styles.downloadInvoiceButton)}
      onClick={onClick}
      loading={isInvoiceGenerating}
    >
      Download Invoice
    </Button>
  );
}
