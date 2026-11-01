import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { RefundCreditNoteDetailActionsBar } from './RefundCreditNoteDetailActionsBar';
import { RefundCreditNoteDetailTab } from './RefundCreditNoteDetailTab';
import { RefundCreditNoteGLEntriesPanel } from './RefundCreditNoteGLEntriesPanel';
import { DrawerMainTabs } from '@/components';

/**
 * Refund credit note detail.
 */
export function RefundCreditNoteDetail() {
  return (
    <RefundCreditNoteDetailRoot>
      <RefundCreditNoteDetailActionsBar />
      <RefundCreditNoteDetailTabs />
    </RefundCreditNoteDetailRoot>
  );
}

/**
 * Refund credit note detail tabs.
 */
function RefundCreditNoteDetailTabs() {
  return (
    <DrawerMainTabs>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<RefundCreditNoteDetailTab />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<RefundCreditNoteGLEntriesPanel />}
      />
    </DrawerMainTabs>
  );
}

const RefundCreditNoteDetailRoot = styled.div``;
