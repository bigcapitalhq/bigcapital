// @ts-nocheck
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useInventoryValuationPdf } from '@/hooks/query';
import { AnchorButton } from '@blueprintjs/core';
import { useInventoryValuationContext } from '../../InventoryValuationProvider';

export default function InventoryValuationPdfDialogContent() {
  const { httpQuery } = useInventoryValuationContext();
  const { isLoading, pdfUrl } = useInventoryValuationPdf(httpQuery);

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
          download={'inventory-valuation-summary.pdf'}
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
