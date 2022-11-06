// @ts-nocheck
import React from 'react';

import { CommercialDocBox } from '@/components';

import CreditNoteDetailHeader from './CreditNoteDetailHeader';
import CreditNoteDetailTable from './CreditNoteDetailTable';
import CreditNoteDetailTableFooter from './CreditNoteDetailTableFooter';
import CreditNoteDetailFooter from './CreditNoteDetailFooter';

/**
 * Credit note details panel.
 */
export default function CreditNoteDetailPanel() {
  return (
    <CommercialDocBox>
      <CreditNoteDetailHeader />
      <CreditNoteDetailTable />
      <CreditNoteDetailTableFooter />
      <CreditNoteDetailFooter />
    </CommercialDocBox>
  );
}
