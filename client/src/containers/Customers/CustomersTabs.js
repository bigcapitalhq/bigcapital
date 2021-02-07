import React, { useState, useCallback } from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import CustomerAddressTabs from './CustomerAddressTabs';
import CustomerAttachmentTabs from './CustomerAttachmentTabs';
import CustomerFinancialPanel from './CustomerFinancialPanel';
import CustomerNotePanel from './CustomerNotePanel';

export default function CustomersTabs() {
  const { formatMessage } = useIntl();

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
          title={formatMessage({ id: 'financial_details' })}
          panel={<CustomerFinancialPanel />}
        />
        <Tab
          id={'address'}
          title={formatMessage({ id: 'address' })}
          panel={<CustomerAddressTabs />}
        />
        <Tab
          id="notes"
          title={formatMessage({ id: 'notes' })}
          panel={<CustomerNotePanel />}
        />
        <Tab
          id={'attachement'}
          title={formatMessage({ id: 'attachement' })}
          panel={<CustomerAttachmentTabs />}
        />
      </Tabs>
    </div>
  );
}
