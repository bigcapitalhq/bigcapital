import React from 'react';
import { FastField } from 'formik';
import {
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarDivider,
} from '@blueprintjs/core';

import { Icon, FormattedMessage as T, CustomSelectList } from 'components';

import { useInvoiceFormContext } from './InvoiceFormProvider';

export default function InvoiceFormTopBar() {
  const { warehouses, branches } = useInvoiceFormContext();

  return (
    <Navbar className={'navbar--dashboard-topbar'}>
      <NavbarGroup align={Alignment.LEFT}>
        <FastField name={'branch'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <CustomSelectList
              items={branches}
              text={'Branch'}
              onItemSelected={(item) => {
                form.setFieldValue('name', item.id);
              }}
              selectedItemId={value}
              buttonProps={{
                icon: <Icon icon={'domain-16'} iconSize={20} />,
              }}
            />
          )}
        </FastField>

        <NavbarDivider />
        <FastField name={'warehouse'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <CustomSelectList
              items={warehouses}
              text={'Warehosue'}
              onItemSelected={(item) => {
                form.setFieldValue('warehouse', item.id);
              }}
              selectedItemId={value}
              buttonProps={{
                icon: <Icon icon={'warehouse-16'} iconSize={20} />,
              }}
            />
          )}
        </FastField>
      </NavbarGroup>
    </Navbar>
  );
}
