// @ts-nocheck
import React from 'react';
import { DrawerBody } from '@/components';

import CreditNoteDetail from './CreditNoteDetail';
import { CreditNoteDetailDrawerProvider } from './CreditNoteDetailDrawerProvider';

/**
 * Credit note detail drawer content.
 */
export default function CreditNoteDetailDrawerContent({
  // #ownProp
  creditNoteId,
}) {
  return (
    <CreditNoteDetailDrawerProvider creditNoteId={creditNoteId}>
      <DrawerBody>
        <CreditNoteDetail />
      </DrawerBody>
    </CreditNoteDetailDrawerProvider>
  );
}
