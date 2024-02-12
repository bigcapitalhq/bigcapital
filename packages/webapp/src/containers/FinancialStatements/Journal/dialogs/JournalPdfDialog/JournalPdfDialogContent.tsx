import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useJournalSheetPdf } from '@/hooks/query';
import { AnchorButton } from '@blueprintjs/core';

export default function JournalSheetPdfDialogContent() {
  const { isLoading, pdfUrl } = useJournalSheetPdf();

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
          download={'journal.pdf'}
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
