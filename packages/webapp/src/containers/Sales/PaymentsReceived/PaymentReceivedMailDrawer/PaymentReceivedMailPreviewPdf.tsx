import { Spinner } from '@blueprintjs/core';
import { SendMailViewPreviewPdfIframe } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewPdfIframe';
import { PaymentReceivedMailPreviewHeader } from './PaymentReceivedMailPreviewHeader';
import { Stack } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useGetPaymentReceiveHtml } from '@/hooks/query';

export function PaymentReceivedSendMailPreviewPdf() {
  return (
    <Stack flex={1} spacing={0}>
      <PaymentReceivedMailPreviewHeader />

      <Stack px={4} py={6}>
        <PaymentReceivedSendPdfPreviewIframe />
      </Stack>
    </Stack>
  );
}

function PaymentReceivedSendPdfPreviewIframe() {
  const { payload } = useDrawerContext();
  const { data, isLoading } = useGetPaymentReceiveHtml(
    payload?.paymentReceivedId,
  );
  if (isLoading && data) {
    return <Spinner size={20} />;
  }
  const iframeSrcDoc = data?.htmlContent;

  return <SendMailViewPreviewPdfIframe srcDoc={iframeSrcDoc} />;
}
