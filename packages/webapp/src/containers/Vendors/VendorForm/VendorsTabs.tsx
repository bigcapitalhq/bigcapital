// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Tabs, Tab } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';

import VendorFinanicalPanelTab from './VendorFinanicalPanelTab';
import VendorAttahmentTab from './VendorAttahmentTab';

import CustomerAddressTabs from '@/containers/Customers/CustomerForm/CustomerAddressTabs';
import CustomerNotePanel from '@/containers/Customers/CustomerForm/CustomerNotePanel';
import styled from 'styled-components';

/**
 * Vendor form tabs.
 */
export default function VendorTabs() {
  
  return (
    <div className={classNames(CLASSES.PAGE_FORM_TABS)}>
      <VendorTabsRoot
        animate={true}
        id={'vendor-tabs'}
        large={true}
        defaultSelectedTabId="financial"
      >
        <Tab
          id={'financial'}
          title={intl.get('financial_details')}
          panel={<VendorFinanicalPanelTab  />}
        />
        <Tab
          id={'address'}
          title={intl.get('address')}
          panel={<CustomerAddressTabs />}
        />
        <Tab
          id="notes"
          title={intl.get('notes')}
          panel={<CustomerNotePanel />}
        />
      </VendorTabsRoot>
    </div>
  );
}

const VendorTabsRoot = styled(Tabs)``;