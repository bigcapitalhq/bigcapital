import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { ReceiptDetailActionBar } from './ReceiptDetailActionBar';
import { ReceiptDetailsGLEntriesPanel } from './ReceiptDetailsGLEntriesPanel';
import { ReceiptDetailTab } from './ReceiptDetailTab';
import { DrawerMainTabs } from '@/components';

/**
 * Receipt view detail.
 */
export function ReceiptDetail() {
  return (
    <ReceiptDetailsRoot>
      <ReceiptDetailActionBar />
      <ReceiptDetailsTabs />
    </ReceiptDetailsRoot>
  );
}

/**
 * Receipt details tabs bar.
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
