import { css } from '@emotion/css';
import { Box } from '@/components';
import { InvoicePaperTemplate } from '../InvoiceCustomize/InvoicePaperTemplate';
import { InvoiceSendMailPreviewWithHeader } from './InvoiceSendMailHeaderPreview';

export function InvoiceSendPdfPreviewConnected() {
  return (
    <InvoiceSendMailPreviewWithHeader>
      <Box px={4} py={6}>
        <InvoicePaperTemplate
          className={css`
            margin: 0 auto;
          `}
        />
      </Box>
    </InvoiceSendMailPreviewWithHeader>
  );
}
