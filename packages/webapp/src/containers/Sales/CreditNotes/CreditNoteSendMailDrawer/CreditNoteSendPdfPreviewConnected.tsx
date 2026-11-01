import { Spinner } from '@blueprintjs/core';
import { SendMailViewPreviewPdfIframe } from '../../Estimates/SendMailViewDrawer/SendMailViewPreviewPdfIframe';
import { CreditNoteSendMailPreviewHeader } from './CreditNoteSendMailPreviewHeader';
import { Stack } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useGetCreditNoteHtml } from '@/hooks/query';

export function CreditNoteSendPdfPreviewConnected() {
  return (
    <Stack spacing={0}>
      <CreditNoteSendMailPreviewHeader />

      <Stack px={4} py={6}>
        <CreditNoteSendPdfPreviewIframe />
      </Stack>
    </Stack>
  );
}

function CreditNoteSendPdfPreviewIframe() {
  const { payload } = useDrawerContext();
  const { data, isLoading } = useGetCreditNoteHtml(payload?.creditNoteId);

  if (isLoading && data) {
    return <Spinner size={20} />;
  }
  const iframeSrcDoc = data?.htmlContent;

  return <SendMailViewPreviewPdfIframe srcDoc={iframeSrcDoc} />;
}
