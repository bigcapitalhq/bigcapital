import { Spinner } from '@blueprintjs/core';
import { Stack } from '@/components';
import { InvoiceSendMailPreviewWithHeader } from './InvoiceSendMailHeaderPreview';
import { useInvoiceHtml } from '@/hooks/query';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { SendMailViewPreviewPdfIframe } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewPdfIframe';

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

  return <SendMailViewPreviewPdfIframe srcDoc={iframeSrcDoc} />;
}
