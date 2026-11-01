import { AnchorButton } from '@blueprintjs/core';
import { useGeneralLedgerContext } from '../../GeneralLedgerProvider';
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useGeneralLedgerPdf } from '@/hooks/query';

export function GeneralLedgerPdfDialogContent() {
  const { httpQuery } = useGeneralLedgerContext();
  const { isLoading, pdfUrl } = useGeneralLedgerPdf(httpQuery);

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
          download={'general-ledger.pdf'}
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
