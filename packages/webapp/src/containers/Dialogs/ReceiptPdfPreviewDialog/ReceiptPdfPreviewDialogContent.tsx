import { AnchorButton } from '@blueprintjs/core';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DialogContent, PdfDocumentPreview, T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { usePdfReceipt } from '@/hooks/query';
import { compose } from '@/utils';

interface ReceiptPdfPreviewDialogContentProps
  extends WithDialogActionsProps {
  subscriptionForm: { receiptId: number | null };
  dialogName?: string;
}

function ReceiptPdfPreviewDialogContentInner({
  subscriptionForm: { receiptId },
}: ReceiptPdfPreviewDialogContentProps): React.ReactElement {
  // Latent bug preserved: payload default is `{ receiptId: null }` — the hook
  // builds URL `receipts/null` when the dialog opens without a real id.
  const { isLoading, pdfUrl, filename } = usePdfReceipt(receiptId as number);

  // FIXME: `target={'__blank'}` should be `_blank` (single underscore) — left
  // as-is to avoid a behavior change in a TS-only slice.
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
          download={filename}
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

export const ReceiptPdfPreviewDialogContent = compose(withDialogActions)(
  ReceiptPdfPreviewDialogContentInner,
);
