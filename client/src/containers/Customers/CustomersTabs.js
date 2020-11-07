import React, { useState, useCallback } from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import CustomerAddressTabs from './CustomerAddressTabs';
import CustomerNotTabs from './CustomerNotTabs';
import CustomerAttachmentTabs from './CustomerAttachmentTabs';
import CustomerFinancialPanel from './CustomerFinancialPanel';

function CustomersTabs({
  setFieldValue,
  getFieldProps,
  errors,
  values,
  touched,
}) {
  const [animate, setAnimate] = useState(true);
  const { formatMessage } = useIntl();
  const handleChangeTabs = useCallback(() => {}, []);

  return (
    <div>
      <Tabs animate={animate} id={'customer-tabs'} large={true}>
        <Tab
          id={'financial'}
          title={formatMessage({ id: 'financial_details' })}
          panel={<CustomerFinancialPanel
            values={values}
            errors={errors} 
            setFieldValue={setFieldValue}
            touched={touched}
          />}
        />
        <Tab
          id={'address'}
          title={formatMessage({ id: 'address' })}
          panel={<CustomerAddressTabs
            setFieldValue={setFieldValue}
            getFieldProps={getFieldProps}
            errors={errors}
            values={values}
            touched={touched}
          />}
        />
        <Tab
          id={'attachement'}
          title={formatMessage({ id: 'attachement' })}
          panel={<CustomerAttachmentTabs />}
        />
        {/* <Tab
          id={'note'}
          title={formatMessage({ id: 'note' })}
          panel={<CustomerNotTabs formik={formik} />}
        /> */}
      </Tabs>
    </div>
  );
}

export default CustomersTabs;
