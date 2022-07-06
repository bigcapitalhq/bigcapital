import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { CLASSES } from '@/common/classes';

import VendorFinanicalPanelTab from './VendorFinanicalPanelTab';
import VendorAttahmentTab from './VendorAttahmentTab';

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
        <Tab
          id={'attachement'}
          title={intl.get('attachement')}
          panel={<VendorAttahmentTab />}
        />
      </Tabs>
    </div>
  );
}
