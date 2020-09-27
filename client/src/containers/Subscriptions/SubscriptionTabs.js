import React, { useState } from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import BillingTab from './BillingTab';
import LicenseTab from './LicenseTab';

export const MeteredBillingTabs = ({ formik }) => {
  const [animate, setAnimate] = useState(true);
  const { formatMessage } = useIntl();

  return (
    <div>
      <Tabs animate={animate} large={true}>
        <Tab
          title={formatMessage({ id: 'billing' })}
          id={'billing'}
          panel={<BillingTab formik={formik} />}
        />
        <Tab
          title={formatMessage({ id: 'usage' })}
          id={'usage'}
          disabled={true}
          // panel={'Usage'}
        />
      </Tabs>
    </div>
  );
};

export const PaymentMethodTabs = ({ formik }) => {
  const [animate, setAnimate] = useState(true);
  const { formatMessage } = useIntl();

  return (
    <div>
      <Tabs animate={animate} large={true}>
        <Tab
          title={formatMessage({ id: 'license' })}
          id={'license'}
          panel={<LicenseTab formik={formik} />}
        />
        <Tab
          title={formatMessage({ id: 'credit_card' })}
          id={'credit_card'}
          disabled={true}
        />
        <Tab
          title={formatMessage({ id: 'paypal' })}
          id={'paypal'}
          disabled={true}
        />
      </Tabs>
    </div>
  );
};
