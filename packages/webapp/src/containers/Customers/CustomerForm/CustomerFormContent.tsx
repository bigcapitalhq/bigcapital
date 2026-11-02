import { Tab } from '@blueprintjs/core';
import { Tabs } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { CustomerFloatingActions } from './CustomerFloatingActions';
import { CustomerFormSections } from './CustomerFormFields';
import { useCustomerFormContext } from './CustomerFormProvider';
import type { CustomerFormValues } from './utils';
import { Card, Group } from '@/components';
import { ExtensionSlot } from '@/extensions/slots/ExtensionSlot';

export function CustomerFormContent() {
  const [selectedTabId, setSelectedTabId] = useState('primary');
  const form = useFormikContext<CustomerFormValues>();
  const { customer } = useCustomerFormContext();

  const handleTabChange = (tabId: string) => {
    const sectionId = String(tabId);
    setSelectedTabId(sectionId);

    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card
      className={css`
        padding-bottom: 0 !important;
      `}
    >
      <Group
        verticalAlign={'top'}
        alignItems={'flex-start'}
        flexWrap={'nowrap'}
      >
        <Tabs
          selectedTabId={selectedTabId}
          onChange={handleTabChange}
          className={css`
            position: sticky;
            top: 20px;
          `}
          vertical
        >
          <Tab id={'primary'} title={'Basic'} />
          <Tab id={'financial'} title={'Financial'} />
          <Tab id={'billingAddress'} title={'Billing address'} />
          <Tab id={'shippingAddress'} title={'Shipping address'} />
          <Tab id={'notes'} title={'Notes'} />
        </Tabs>

        <div>
          <CustomerFormSections />

          <ExtensionSlot
            name="contact.form.fields"
            context={{ contact: customer, form }}
          />
        </div>
      </Group>
      <CustomerFloatingActions />
    </Card>
  );
}
