import { AnchorButton } from '@blueprintjs/core';
import { useCashFlowStatementContext } from '../CashFlowStatementProvider';
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useCashflowSheetPdf } from '@/hooks/query';

export function CashflowSheetPdfDialogContent() {
  const { httpQuery } = useCashFlowStatementContext();
  const { isLoading, pdfUrl } = useCashflowSheetPdf(httpQuery);

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
          download={'invoice.pdf'}
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
