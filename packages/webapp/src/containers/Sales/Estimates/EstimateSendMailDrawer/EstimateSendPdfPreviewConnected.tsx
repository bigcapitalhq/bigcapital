import { Spinner } from '@blueprintjs/core';
import { SendMailViewPreviewPdfIframe } from '../SendMailViewDrawer/SendMailViewPreviewPdfIframe';
import { EstimateSendMailPreviewHeader } from './EstimateSendMailPreviewHeader';
import { Stack } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useGetSaleEstimateHtml } from '@/hooks/query';

export function EstimateSendPdfPreviewConnected() {
  return (
    <Stack spacing={0}>
      <EstimateSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <EstimateSendPdfPreviewIframe />
      </Stack>
    </Stack>
  );
}

function EstimateSendPdfPreviewIframe() {
  const { payload } = useDrawerContext();
  const { data, isLoading } = useGetSaleEstimateHtml(payload?.estimateId);

  if (isLoading && data) {
    return <Spinner size={20} />;
  }
  const iframeSrcDoc = data?.htmlContent;

  return <SendMailViewPreviewPdfIframe srcDoc={iframeSrcDoc} />;
}
