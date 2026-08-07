// @ts-nocheck
import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { RefundVendorCreditDetailActionsBar } from './RefundVendorCreditDetailActionsBar';
import { RefundVendorCreditDetailTab } from './RefundVendorCreditDetailTab';
import { DrawerMainTabs } from '@/components';

/**
 * Refund vendor credit detail.
 * @returns {React.JSX}
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
 * @returns {React.JSX}
 */
function RefundVendorCreditDetailTabs() {
  return (
    <DrawerMainTabs>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<RefundVendorCreditDetailTab />}
      />
    </DrawerMainTabs>
  );
}

const RefundVendorCreditDetailRoot = styled.div``;
