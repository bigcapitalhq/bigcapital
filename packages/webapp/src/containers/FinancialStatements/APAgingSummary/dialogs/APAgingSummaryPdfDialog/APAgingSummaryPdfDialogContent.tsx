// @ts-nocheck
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useAPAgingSummaryPdf } from '@/hooks/query';
import { AnchorButton } from '@blueprintjs/core';
import { useAPAgingSummaryContext } from '../../APAgingSummaryProvider';

export default function APAgingSummaryPdfDialogContent() {
  const { httpQuery } = useAPAgingSummaryContext();
  const { isLoading, pdfUrl } = useAPAgingSummaryPdf(httpQuery);

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
          download={'AP_aging_summary.pdf'}
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
