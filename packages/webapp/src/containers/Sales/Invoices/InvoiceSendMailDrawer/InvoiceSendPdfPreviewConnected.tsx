import { Spinner } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Stack } from '@/components';
import { InvoiceSendMailPreviewWithHeader } from './InvoiceSendMailHeaderPreview';
import { useInvoiceHtml } from '@/hooks/query';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

export function InvoiceSendPdfPreviewConnected() {
  return (
    <InvoiceSendMailPreviewWithHeader>
      <Stack px={4} py={6}>
        <InvoiceSendPdfPreviewIframe />
      </Stack>
    </InvoiceSendMailPreviewWithHeader>
  );
}

function InvoiceSendPdfPreviewIframe() {
  const { payload } = useDrawerContext();
  const { data, isLoading } = useInvoiceHtml(payload?.invoiceId);

  if (isLoading && data) {
    return <Spinner size={20} />;
  }
  const iframeSrcDoc = data?.htmlContent;

  return (
    <iframe
      title={'invoice-pdf-preview'}
      srcDoc={iframeSrcDoc}
      className={css`
        height: 1123px;
        width: 794px;
        border: 0;
        border-radius: 5px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
        margin: 0 auto;
      `}
    />
  );
}
