// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Tab } from '@blueprintjs/core';

import { DrawerMainTabs } from '@/components';

import PaymentReceiveDetailTab from './PaymentReceiveDetailTab';
import PaymentReceiveActionsBar from './PaymentReceiveActionsBar';
import { PaymentReceiveGLEntriesPanel } from './PaymentReceiveGLEntriesPanel';

/**
 * Payment receive details tabs.
 * @returns {React.JSX}
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
 * @returns {React.JSX}
 */
export default function PaymentReceiveDetail() {
  return (
    <PaymentReceiveDetailsRoot>
      <PaymentReceiveActionsBar />
      <PaymentReceiveDetailsTabs />
    </PaymentReceiveDetailsRoot>
  );
}

const PaymentReceiveDetailsRoot = styled.div``;
