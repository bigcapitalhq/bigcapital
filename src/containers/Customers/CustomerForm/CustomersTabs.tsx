import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import CustomerAddressTabs from './CustomerAddressTabs';
import CustomerAttachmentTabs from './CustomerAttachmentTabs';
import CustomerFinancialPanel from './CustomerFinancialPanel';
import CustomerNotePanel from './CustomerNotePanel';

export default function CustomersTabs() {
  

  return (
    <div>
      <Tabs
        animate={true}
        id={'customer-tabs'}
        large={true}
        defaultSelectedTabId="financial"
      >
        <Tab
          id={'financial'}
          title={intl.get('financial_details')}
          panel={<CustomerFinancialPanel />}
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
          panel={<CustomerAttachmentTabs />}
        />
      </Tabs>
    </div>
  );
}
