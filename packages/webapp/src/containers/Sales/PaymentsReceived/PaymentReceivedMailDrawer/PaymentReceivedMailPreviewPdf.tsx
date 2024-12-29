import { Spinner } from '@blueprintjs/core';
import { Stack } from '@/components';
import { useGetPaymentReceiveHtml } from '@/hooks/query';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { SendMailViewPreviewPdfIframe } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewPdfIframe';
import { PaymentReceivedMailPreviewHeader } from './PaymentReceivedMailPreviewHeader';

export function PaymentReceivedSendMailPreviewPdf() {
  return (
    <Stack flex={1}>
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
