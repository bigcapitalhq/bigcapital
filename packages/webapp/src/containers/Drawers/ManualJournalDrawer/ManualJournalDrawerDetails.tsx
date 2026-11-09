import React from 'react';
import styled from 'styled-components';
import { ManualJournalDrawerActionBar } from './ManualJournalDrawerActionBar';
import { ManualJournalDrawerFooter } from './ManualJournalDrawerFooter';
import { ManualJournalDrawerHeader } from './ManualJournalDrawerHeader';
import { ManualJournalDrawerTable } from './ManualJournalDrawerTable';
import { CommercialDocBox } from '@/components';

/**
 * Manual journal view details.
 */
export function ManualJournalDrawerDetails() {
  return (
    <ManualJournalDetailsRoot>
      <ManualJournalDrawerActionBar />

      <CommercialDocBox>
        <ManualJournalDrawerHeader />
        <ManualJournalDrawerTable />
        <ManualJournalDrawerFooter />
      </CommercialDocBox>
    </ManualJournalDetailsRoot>
  );
}

const ManualJournalDetailsRoot = styled.div``;
