// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Tabs, Tab } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';

import VendorFinancialPanelTab from './VendorFinancialPanelTab';

import CustomerAddressTabs from '@/containers/Customers/CustomerForm/CustomerAddressTabs';
import CustomerNotePanel from '@/containers/Customers/CustomerForm/CustomerNotePanel';

/**
 * Vendor form tabs.
 */
export default function VendorTabs() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_TABS)}>
      <Tabs
        animate={true}
        id={'vendor-tabs'}
        large={true}
        defaultSelectedTabId="financial"
      >
        <Tab
          id={'financial'}
          title={intl.get('financial_details')}
          panel={<VendorFinancialPanelTab />}
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
      </Tabs>
    </div>
  );
}
