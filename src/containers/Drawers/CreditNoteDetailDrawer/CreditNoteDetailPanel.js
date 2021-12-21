import React from 'react';

import { CommercialDocBox } from 'components';

import CreditNoteDetailHeader from './CreditNoteDetailHeader';
import CreditNoteDetailTable from './CreditNoteDetailTable';
import CreditNoteDetailDrawerFooter from './CreditNoteDetailDrawerFooter';

/**
 * Credit note details panel.
 */
export default function CreditNoteDetailPanel() {
  return (
    <CommercialDocBox>
      <CreditNoteDetailHeader />
      <CreditNoteDetailTable />
      <CreditNoteDetailDrawerFooter />
    </CommercialDocBox>
  );
}
