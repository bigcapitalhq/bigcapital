// @ts-nocheck
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useSalesByItemsPdfExport } from '@/hooks/query';
import { AnchorButton } from '@blueprintjs/core';
import { useSalesByItemsContext } from '../../SalesByItemProvider';

export default function SalesByItemsPdfDialogContent() {
  const { httpQuery } = useSalesByItemsContext();
  const { isLoading, pdfUrl } = useSalesByItemsPdfExport(httpQuery);

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
          download={'sales_by_items.pdf'}
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
