import React, { useState, useCallback } from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import CustomerAddressTabs from './CustomerAddressTabs';
import CustomerAttachmentTabs from './CustomerAttachmentTabs';
import CustomerFinancialPanel from './CustomerFinancialPanel';
import CustomerNotePanel from './CustomerNotePanel';

export default function CustomersTabs({
  setFieldValue,
  getFieldProps,
  errors,
  values,
  touched,
}) {
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
          panel={
            <CustomerFinancialPanel
              values={values}
              errors={errors}
              setFieldValue={setFieldValue}
              touched={touched}
            />
          }
        />
        <Tab
          id={'address'}
          title={formatMessage({ id: 'address' })}
          panel={
            <CustomerAddressTabs
              setFieldValue={setFieldValue}
              getFieldProps={getFieldProps}
              errors={errors}
              values={values}
              touched={touched}
            />
          }
        />
        <Tab
          id="notes"
          title={formatMessage({ id: 'notes' })}
          panel={
            <CustomerNotePanel
              errors={errors}
              touched={touched}
              getFieldProps={getFieldProps}
            />
          }
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
