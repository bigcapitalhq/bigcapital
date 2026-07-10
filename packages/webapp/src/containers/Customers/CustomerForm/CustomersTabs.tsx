import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { CustomerAddressTabs } from './CustomerAddressTabs';
import { CustomerAttachmentTabs } from './CustomerAttachmentTabs';
import { CustomerFormFinancialSection } from './CustomerFormFinancialSection';
import { CustomerNotePanel } from './CustomerNotePanel';

export function CustomersTabs() {
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
          panel={<CustomerFormFinancialSection />}
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
