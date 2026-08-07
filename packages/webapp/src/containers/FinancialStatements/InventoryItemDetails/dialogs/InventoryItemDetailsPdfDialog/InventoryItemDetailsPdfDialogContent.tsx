import { AnchorButton } from '@blueprintjs/core';
import React from 'react';
import { useInventoryItemDetailsContext } from '../../InventoryItemDetailsProvider';
import {
  DialogContent,
  PdfDocumentPreview,
  FormattedMessage as T,
} from '@/components';
import { useInventoryItemDetailsPdf } from '@/hooks/query';

interface InventoryItemDetailsPdfDialogContentProps {
  dialogName: string;
}

export function InventoryItemDetailsPdfDialogContent({
  dialogName,
}: InventoryItemDetailsPdfDialogContentProps) {
  const { httpQuery } = useInventoryItemDetailsContext();
  const { isLoading, pdfUrl } = useInventoryItemDetailsPdf(httpQuery);

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
          download={'inventory-item-details.pdf'}
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
