import { Spinner } from '@blueprintjs/core';
import { SendMailViewPreviewPdfIframe } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewPdfIframe';
import { InvoiceSendMailPreviewWithHeader } from './InvoiceSendMailHeaderPreview';
import { Stack } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useInvoiceHtml } from '@/hooks/query';

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
  const iframeSrcDoc = data;

  return <SendMailViewPreviewPdfIframe srcDoc={iframeSrcDoc} />;
}
