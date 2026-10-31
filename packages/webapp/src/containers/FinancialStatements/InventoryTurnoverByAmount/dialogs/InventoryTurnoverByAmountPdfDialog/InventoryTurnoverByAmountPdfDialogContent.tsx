import { AnchorButton } from '@blueprintjs/core';
import React from 'react';
import { useInventoryTurnoverByAmountContext } from '../../InventoryTurnoverByAmountProvider';
import {
  DialogContent,
  FormattedMessage as T,
  PdfDocumentPreview,
} from '@/components';
import { useInventoryTurnoverByAmountPdf } from '@/hooks/query';

interface InventoryTurnoverByAmountPdfDialogContentProps {
  dialogName: string;
}

export function InventoryTurnoverByAmountPdfDialogContent({
  dialogName,
}: InventoryTurnoverByAmountPdfDialogContentProps) {
  const { httpQuery } = useInventoryTurnoverByAmountContext();
  const { isLoading, pdfUrl } = useInventoryTurnoverByAmountPdf(httpQuery);

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
          download={'inventory-turnover-by-amount.pdf'}
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
