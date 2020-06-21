import React, { useState, useCallback } from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import CustomerAddressTabs from './CustomerAddressTabs';
import CustomerNotTabs from './CustomerNotTabs';
import CustomerAttachmentTabs from './CustomerAttachmentTabs';

function CustomersTabs({ formik }) {
  const [animate, setAnimate] = useState(true);
  const { formatMessage } = useIntl();
  const handleChangeTabs = useCallback(() => {}, []);

  return (
    <div>
      <Tabs animate={animate} id={'customer-tabs'} large={true}>
        <Tab
          id={'other'}
          title={formatMessage({ id: 'other' })}
          panel={'Other'}
        />
        <Tab
          id={'address'}
          title={formatMessage({ id: 'address' })}
          panel={<CustomerAddressTabs formik={formik} />}
        />
        <Tab
          id={'attachement'}
          title={formatMessage({ id: 'attachement' })}
          panel={<CustomerAttachmentTabs />}
        />
        <Tab
          id={'note'}
          title={formatMessage({ id: 'note' })}
          panel={<CustomerNotTabs formik={formik} />}
        />
      </Tabs>
    </div>
  );
}

export default CustomersTabs;
