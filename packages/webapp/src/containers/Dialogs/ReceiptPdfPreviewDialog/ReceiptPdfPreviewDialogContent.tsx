// @ts-nocheck
import React from 'react';
import { AnchorButton } from '@blueprintjs/core';

import { DialogContent, PdfDocumentPreview, T } from '@/components';
import { usePdfReceipt } from '@/hooks/query';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

function ReceiptPdfPreviewDialogContent({
  subscriptionForm: { receiptId },
  // #withDialogActions
  closeDialog,
}) {
  const { isLoading, pdfUrl, filename } = usePdfReceipt(receiptId);

  return (
    <DialogContent>
      <div class="dialog__header-actions">
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

export default compose(withDialogActions)(ReceiptPdfPreviewDialogContent);
