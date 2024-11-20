import { Stack } from '@/components';
import { ReceiptSendMailPreviewHeader } from './ReceiptSendMailPreviewHeader';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useGetSaleReceiptHtml } from '@/hooks/query';
import { Spinner } from '@blueprintjs/core';
import { SendMailViewPreviewPdfIframe } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewPdfIframe';

export function ReceiptSendMailPdfPreview() {
  return (
    <Stack>
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

  console.log(data, 'data');

  return <SendMailViewPreviewPdfIframe srcDoc={iframeSrcDoc} />;
}
