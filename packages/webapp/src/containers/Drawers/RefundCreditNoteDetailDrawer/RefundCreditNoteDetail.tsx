// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Tab } from '@blueprintjs/core';

import { DrawerMainTabs } from '@/components';
import RefundCreditNoteDetailTab from './RefundCreditNoteDetailTab';
import RefundCreditNoteDetailActionsBar from './RefundCreditNoteDetailActionsBar';

/**
 * Refund credit note detail.
 * @returns {React.JSX}
 */
export default function RefundCreditNoteDetail() {
  return (
    <RefundCreditNoteDetailRoot>
      <RefundCreditNoteDetailActionsBar />
      <RefundCreditNoteDetailTabs />
    </RefundCreditNoteDetailRoot>
  );
}

/**
 * Refund credit note detail tabs.
 * @returns {React.JSX}
 */
function RefundCreditNoteDetailTabs() {
  return (
    <DrawerMainTabs>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<RefundCreditNoteDetailTab />}
      />
    </DrawerMainTabs>
  );
}

const RefundCreditNoteDetailRoot = styled.div``;
