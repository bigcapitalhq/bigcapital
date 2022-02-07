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
        <FastField name={'branch_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <CustomSelectList
              items={branches}
              text={'Branch'}
              onItemSelected={({ id }) => {
                form.setFieldValue('branch_id', id);
              }}
              selectedItemId={value}
              buttonProps={{
                icon: <Icon icon={'branch-16'} iconSize={20} />,
              }}
            />
          )}
        </FastField>

        <NavbarDivider />
        <FastField name={'warehouse_id'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <CustomSelectList
              items={warehouses}
              text={'Warehosue'}
              onItemSelected={({ id }) => {
                form.setFieldValue('warehouse_id', id);
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
