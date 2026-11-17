import { AnchorButton } from '@blueprintjs/core';
import { useInventorySummaryContext } from '../../InventorySummaryProvider';
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useInventorySummaryPdf } from '@/hooks/query';

interface InventorySummaryPdfDialogContentProps {
  dialogName?: string;
}

export function InventorySummaryPdfDialogContent({
  dialogName,
}: InventorySummaryPdfDialogContentProps) {
  const { httpQuery } = useInventorySummaryContext();
  const { isLoading, pdfUrl } = useInventorySummaryPdf(httpQuery);

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
          download={'inventory_summary.pdf'}
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
