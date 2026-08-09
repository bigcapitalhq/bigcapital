import { AnchorButton } from '@blueprintjs/core';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DialogContent, PdfDocumentPreview, T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { usePdfEstimate } from '@/hooks/query';
import { compose } from '@/utils';

interface EstimatePdfPreviewDialogContentProps extends WithDialogActionsProps {
  subscriptionForm: { estimateId: number | null };
  dialogName?: string;
}

function EstimatePdfPreviewDialogContentInner({
  subscriptionForm: { estimateId },
}: EstimatePdfPreviewDialogContentProps): React.ReactElement {
  const { isLoading, isError, pdfUrl, filename } = usePdfEstimate(
    estimateId as number,
  );

  return (
    <DialogContent>
      <div className="dialog__header-actions">
        <AnchorButton
          href={pdfUrl}
          target="_blank"
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
        isError={isError}
        url={pdfUrl}
      />
    </DialogContent>
  );
}

export const EstimatePdfPreviewDialogContent = compose(withDialogActions)(
  EstimatePdfPreviewDialogContentInner,
);
