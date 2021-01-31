import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import BillingTab from './BillingTab';
import LicenseTab from './LicenseTab';

/**
 * Master billing tabs.
 */
export const MasterBillingTabs = ({ formik }) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <Tabs animate={true} large={true}>
        <Tab
          title={formatMessage({ id: 'billing' })}
          id={'billing'}
          panel={<BillingTab formik={formik} />}
        />
        <Tab
          title={formatMessage({ id: 'usage' })}
          id={'usage'}
          disabled={true}
        />
      </Tabs>
    </div>
  );
};

/**
 * Payment methods tabs.
 */
export const PaymentMethodTabs = ({ formik }) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <Tabs animate={true} large={true}>
        <Tab
          title={formatMessage({ id: 'voucher' })}
          id={'voucher'}
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
