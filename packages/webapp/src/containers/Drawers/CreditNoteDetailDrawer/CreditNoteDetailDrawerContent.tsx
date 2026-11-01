import React from 'react';
import { CreditNoteDetail } from './CreditNoteDetail';
import { CreditNoteDetailDrawerProvider } from './CreditNoteDetailDrawerProvider';
import { DrawerBody } from '@/components';

interface CreditNoteDetailDrawerContentProps {
  creditNoteId: number | undefined;
}

/**
 * Credit note detail drawer content.
 */
export function CreditNoteDetailDrawerContent({
  creditNoteId,
}: CreditNoteDetailDrawerContentProps) {
  return (
    <CreditNoteDetailDrawerProvider creditNoteId={creditNoteId}>
      <DrawerBody>
        <CreditNoteDetail />
      </DrawerBody>
    </CreditNoteDetailDrawerProvider>
  );
}
