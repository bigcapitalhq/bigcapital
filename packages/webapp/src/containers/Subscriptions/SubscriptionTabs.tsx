// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Tabs, Tab } from '@blueprintjs/core';
import BillingTab from './BillingTab';
import LicenseTab from './LicenseTab';

/**
 * Master billing tabs.
 */
export const MasterBillingTabs = ({ formik }) => {
  return (
    <div>
      <Tabs animate={true} large={true}>
        <Tab
          title={intl.get('billing')}
          id={'billing'}
          panel={<BillingTab formik={formik} />}
        />
        <Tab title={intl.get('usage')} id={'usage'} disabled={true} />
      </Tabs>
    </div>
  );
};

/**
 * Payment methods tabs.
 */
export const PaymentMethodTabs = ({ formik }) => {
  return (
    <div>
      <Tabs animate={true} large={true}>
        <Tab
          title={intl.get('voucher')}
          id={'voucher'}
          panel={<LicenseTab formik={formik} />}
        />
        <Tab
          title={intl.get('credit_card')}
          id={'credit_card'}
          disabled={true}
        />
        <Tab title={intl.get('paypal')} id={'paypal'} disabled={true} />
      </Tabs>
    </div>
  );
};
