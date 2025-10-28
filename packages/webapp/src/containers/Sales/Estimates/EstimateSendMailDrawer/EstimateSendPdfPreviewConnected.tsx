import { Spinner } from '@blueprintjs/core';
import { Stack } from '@/components';
import { useGetSaleEstimateHtml } from '@/hooks/query';
import { EstimateSendMailPreviewHeader } from './EstimateSendMailPreviewHeader';
import { SendMailViewPreviewPdfIframe } from '../SendMailViewDrawer/SendMailViewPreviewPdfIframe';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

export function EstimateSendPdfPreviewConnected() {
  return (
    <Stack>
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
