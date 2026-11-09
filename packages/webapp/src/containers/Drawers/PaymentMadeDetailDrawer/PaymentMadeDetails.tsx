import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { PaymentMadeDetailActionsBar } from './PaymentMadeDetailActionsBar';
import { PaymentMadeDetailTab } from './PaymentMadeDetailTab';
import { PaymentMadeGLEntriesPanel } from './PaymentMadeGLEntriesPanel';
import { DrawerMainTabs } from '@/components';

/**
 * Payment made details tabs.
 */
function PaymentMadeDetailsTabs() {
  return (
    <DrawerMainTabs defaultSelectedTabId="details">
      <Tab
        id={'details'}
        title={intl.get('details')}
        panel={<PaymentMadeDetailTab />}
      />
      <Tab
        id={'journal_entries'}
        title={intl.get('journal_entries')}
        panel={<PaymentMadeGLEntriesPanel />}
      />
    </DrawerMainTabs>
  );
}

/**
 * Payment made view detail.
 */
export function PaymentMadeDetail() {
  return (
    <PaymentMadeDetailsRoot>
      <PaymentMadeDetailActionsBar />
      <PaymentMadeDetailsTabs />
    </PaymentMadeDetailsRoot>
  );
}

const PaymentMadeDetailsRoot = styled.div``;
