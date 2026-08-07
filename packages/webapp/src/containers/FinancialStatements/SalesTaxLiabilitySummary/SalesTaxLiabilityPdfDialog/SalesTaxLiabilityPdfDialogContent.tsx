import { AnchorButton } from '@blueprintjs/core';
import { useSalesTaxLiabilitySummaryContext } from '../SalesTaxLiabilitySummaryBoot';
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useSalesTaxLiabilitySummaryPdf } from '@/hooks/query';

export function SalesTaxLiabilityPdfDialogContent() {
  const { query } = useSalesTaxLiabilitySummaryContext();
  const { isLoading, pdfUrl } = useSalesTaxLiabilitySummaryPdf(query);

  return (
    <DialogContent>
      <div className="dialog__header-actions">
        <AnchorButton
          href={pdfUrl}
          target={'__blank'}
          minimal={true}
          outlined={true}
        >
          <T id={'pdf_preview.preview.button'} />
        </AnchorButton>

        <AnchorButton
          href={pdfUrl}
          download={'sales-tax-liability-summary.pdf'}
          minimal={true}
          outlined={true}
        >
          <T id={'pdf_preview.download.button'} />
        </AnchorButton>
      </div>

      <PdfDocumentPreview
        height={760}
        width={1000}
        isLoading={isLoading}
        url={pdfUrl}
      />
    </DialogContent>
  );
}
