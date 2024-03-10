// @ts-nocheck
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { AnchorButton } from '@blueprintjs/core';
import { useProfitLossSheetPdf } from '@/hooks/query';
import { useProfitLossSheetContext } from '../ProfitLossProvider';

export default function ProfitLossSheetPdfDialogContent() {
  const { httpQuery } = useProfitLossSheetContext();
  const { isLoading, pdfUrl } = useProfitLossSheetPdf(httpQuery);

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
          download={'profit_loss_sheet.pdf'}
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
