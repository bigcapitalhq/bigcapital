import { AnchorButton } from '@blueprintjs/core';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DialogContent, PdfDocumentPreview, T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { usePdfCreditNote } from '@/hooks/query';
import { compose } from '@/utils';

interface CreditNotePdfPreviewDialogContentProps
  extends WithDialogActionsProps {
  subscriptionForm: { creditNoteId: number | string | null };
  dialogName?: string;
}

function CreditNotePdfPreviewDialogContentInner({
  subscriptionForm: { creditNoteId },
}: CreditNotePdfPreviewDialogContentProps): React.ReactElement {
  // Latent bug preserved: payload default is `{ creditNoteId: null }` — the
  // hook builds URL `credit-notes/null` when the dialog opens without a real id.
  const { isLoading, pdfUrl, filename } = usePdfCreditNote(
    creditNoteId as number | string,
  );

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

export const CreditNotePdfPreviewDialogContent = compose(withDialogActions)(
  CreditNotePdfPreviewDialogContentInner,
);
