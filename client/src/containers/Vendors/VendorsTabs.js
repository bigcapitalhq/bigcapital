import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import VendorFinanicalPanelTab from './VendorFinanicalPanelTab';
import VendorAttahmentTab from './VendorAttahmentTab';
import CustomerAddressTabs from 'containers/Customers/CustomerAddressTabs';
import CustomerNotePanel from 'containers/Customers/CustomerNotePanel';

export default function VendorTabs({ vendor }) {
  const { formatMessage } = useIntl();
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
          title={formatMessage({ id: 'financial_details' })}
          panel={<VendorFinanicalPanelTab vendorId={vendor} />}
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
          panel={<VendorAttahmentTab />}
        />
      </Tabs>
    </div>
  );
}
