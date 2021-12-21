import React from 'react';
import styled from 'styled-components';

import { Card } from 'components';

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

      <div className="journal-drawer__content">
        <Card>
          <ManualJournalDrawerHeader />
          <ManualJournalDrawerTable />
          <ManualJournalDrawerFooter />
        </Card>
      </div>
    </ManualJournalDetailsRoot>
  );
}


const ManualJournalDetailsRoot = styled.div``;