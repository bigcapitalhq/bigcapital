import React from 'react';
import { CreditNoteDetailFooter } from './CreditNoteDetailFooter';
import { CreditNoteDetailHeader } from './CreditNoteDetailHeader';
import { CreditNoteDetailTable } from './CreditNoteDetailTable';
import { CreditNoteDetailTableFooter } from './CreditNoteDetailTableFooter';
import { CommercialDocBox } from '@/components';

/**
 * Credit note details panel.
 */
export function CreditNoteDetailPanel() {
  return (
    <CommercialDocBox>
      <CreditNoteDetailHeader />
      <CreditNoteDetailTable />
      <CreditNoteDetailTableFooter />
      <CreditNoteDetailFooter />
    </CommercialDocBox>
  );
}
