import { Spinner } from '@blueprintjs/core';
import { SendMailViewPreviewPdfIframe } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewPdfIframe';
import { ReceiptSendMailPreviewHeader } from './ReceiptSendMailPreviewHeader';
import { Stack } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useGetSaleReceiptHtml } from '@/hooks/query';

export function ReceiptSendMailPdfPreview() {
  return (
    <Stack spacing={0}>
      <ReceiptSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <ReceiptSendPdfPreviewIframe />
      </Stack>
    </Stack>
  );
}

function ReceiptSendPdfPreviewIframe() {
  const { payload } = useDrawerContext();
  const { data, isLoading } = useGetSaleReceiptHtml(payload?.receiptId);

  if (isLoading && data) {
    return <Spinner size={20} />;
  }
  const iframeSrcDoc = data?.htmlContent;

  return <SendMailViewPreviewPdfIframe srcDoc={iframeSrcDoc} />;
}
