import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { RefundVendorCreditDetailActionsBar } from './RefundVendorCreditDetailActionsBar';
import { RefundVendorCreditDetailTab } from './RefundVendorCreditDetailTab';
import { RefundVendorCreditGLEntriesPanel } from './RefundVendorCreditGLEntriesPanel';
import { DrawerMainTabs } from '@/components';

/**
 * Refund vendor credit detail.
 */
export function RefundVendorCreditDetail() {
  return (
    <RefundVendorCreditDetailRoot>
      <RefundVendorCreditDetailActionsBar />
      <RefundVendorCreditDetailTabs />
    </RefundVendorCreditDetailRoot>
  );
}

/**
 * Refund vendor credit detail tabs.
 */
function RefundVendorCreditDetailTabs() {
  return (
    <DrawerMainTabs>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<RefundVendorCreditDetailTab />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<RefundVendorCreditGLEntriesPanel />}
      />
    </DrawerMainTabs>
  );
}

const RefundVendorCreditDetailRoot = styled.div``;
