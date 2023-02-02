// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Tab } from '@blueprintjs/core';

import { DrawerMainTabs } from '@/components';
import ReceiptDetailTab from './ReceiptDetailTab';
import ReceiptDetailActionBar from './ReceiptDetailActionBar';
import { ReceiptDetailsGLEntriesPanel } from './ReceiptDetailsGLEntriesPanel';

/**
 * Receipt view detail.
 * @returns {React.JSX}
 */
export default function ReceiptDetail() {
  return (
    <ReceiptDetailsRoot>
      <ReceiptDetailActionBar />
      <ReceiptDetailsTabs />
    </ReceiptDetailsRoot>
  );
}

/**
 * Receipt details tabs bar.
 * @returns {React.JSX}
 */
function ReceiptDetailsTabs() {
  return (
    <DrawerMainTabs defaultSelectedTabId="details">
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<ReceiptDetailTab />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<ReceiptDetailsGLEntriesPanel />}
      />
    </DrawerMainTabs>
  );
}

const ReceiptDetailsRoot = styled.div``;
