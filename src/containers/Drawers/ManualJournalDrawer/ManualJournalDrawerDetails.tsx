// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { CommercialDocBox } from '@/components';

import ManualJournalDrawerActionBar from './ManualJournalDrawerActionBar';
import ManualJournalDrawerHeader from './ManualJournalDrawerHeader';
import ManualJournalDrawerTable from './ManualJournalDrawerTable';
import ManualJournalDrawerFooter from './ManualJournalDrawerFooter';

/**
 * Manual journal view details.
 */
export default function ManualJournalDrawerDetails() {
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
