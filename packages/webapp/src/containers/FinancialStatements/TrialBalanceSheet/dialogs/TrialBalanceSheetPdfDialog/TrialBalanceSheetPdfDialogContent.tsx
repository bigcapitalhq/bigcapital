import { AnchorButton } from '@blueprintjs/core';
import { useTrialBalanceSheetContext } from '../../TrialBalanceProvider';
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useTrialBalanceSheetPdf } from '@/hooks/query';

interface TrialBalanceSheetPdfDialogContentProps {
  dialogName?: string;
  subscriptionForm?: Record<string, unknown>;
}

export function TrialBalanceSheetPdfDialogContent(
  _props: TrialBalanceSheetPdfDialogContentProps,
) {
  const { httpQuery } = useTrialBalanceSheetContext();
  const { isLoading, pdfUrl } = useTrialBalanceSheetPdf(httpQuery);

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
          download={'trial_balance_sheet.pdf'}
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
