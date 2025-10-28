// @ts-nocheck
import React from 'react';
import { AnchorButton } from '@blueprintjs/core';

import { DialogContent, PdfDocumentPreview, T } from '@/components';
import { usePdfInvoice } from '@/hooks/query';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

function InvoicePdfPreviewDialogContent({
  subscriptionForm: { invoiceId },
  // #withDialog
  closeDialog,
}) {
  const { isLoading, pdfUrl, filename } = usePdfInvoice(invoiceId);

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

export default compose(withDialogActions)(InvoicePdfPreviewDialogContent);
