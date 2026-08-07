import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { PaymentReceiveActionsBar } from './PaymentReceiveActionsBar';
import { PaymentReceiveDetailTab } from './PaymentReceiveDetailTab';
import { PaymentReceiveGLEntriesPanel } from './PaymentReceiveGLEntriesPanel';
import { DrawerMainTabs } from '@/components';

/**
 * Payment receive details tabs.
 */
function PaymentReceiveDetailsTabs() {
  return (
    <DrawerMainTabs defaultSelectedTabId="details">
      <Tab
        id={'details'}
        title={intl.get('details')}
        panel={<PaymentReceiveDetailTab />}
      />
      <Tab
        id={'journal_entries'}
        title={intl.get('journal_entries')}
        panel={<PaymentReceiveGLEntriesPanel />}
      />
    </DrawerMainTabs>
  );
}

/**
 * Payment receive view detail.
 */
export function PaymentReceiveDetail() {
  return (
    <PaymentReceiveDetailsRoot>
      <PaymentReceiveActionsBar />
      <PaymentReceiveDetailsTabs />
    </PaymentReceiveDetailsRoot>
  );
}

const PaymentReceiveDetailsRoot = styled.div``;
