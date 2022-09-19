// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Tab } from '@blueprintjs/core';

import { DrawerMainTabs } from '@/components';

import PaymentMadeDetailActionsBar from './PaymentMadeDetailActionsBar';
import PaymentMadeDetailTab from './PaymentMadeDetailTab';
import PaymentMadeGLEntriesPanel from './PaymentMadeGLEntriesPanel';

/**
 * Payment made - view detail.
 * @returns {React.JSX}
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
 * @returns {React.JSX}
 */
export default function PaymentMadeDetail() {
  return (
    <PaymentMadeDetailsRoot>
      <PaymentMadeDetailActionsBar />
      <PaymentMadeDetailsTabs />
    </PaymentMadeDetailsRoot>
  );
}

const PaymentMadeDetailsRoot = styled.div``;
