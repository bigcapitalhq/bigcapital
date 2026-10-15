import { AnchorButton } from '@blueprintjs/core';
import { useBudgetVsActualContext } from '../BudgetVsActualBoot';
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useBudgetVsActualPdf } from '@/hooks/query';

export function BudgetVsActualPdfDialogContent() {
  const { query } = useBudgetVsActualContext();
  const { isLoading, pdfUrl } = useBudgetVsActualPdf(query);

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
          download={'budget-vs-actual.pdf'}
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
