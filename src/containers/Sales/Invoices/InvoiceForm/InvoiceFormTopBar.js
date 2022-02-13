import React from 'react';
import { FastField } from 'formik';
import {
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarDivider,
} from '@blueprintjs/core';

import { useFeatureCan } from 'hooks/state';
import {
  Icon,
  FormattedMessage as T,
  CustomSelectList,
  FeatureCan,
} from 'components';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { Features } from 'common';

export default function InvoiceFormTopBar() {
  const { warehouses, branches } = useInvoiceFormContext();

  const { featureCan } = useFeatureCan();

  // Can't display the navigation bar if warehouses or branches feature is not enabled.
  if (!featureCan(Features.Warehouses) || !featureCan(Features.Branches)) {
    return null;
  }
  return (
    <Navbar className={'navbar--dashboard-topbar'}>
      <NavbarGroup align={Alignment.LEFT}>
        <FeatureCan feature={Features.Warehouses}>
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
        </FeatureCan>

        {featureCan(Features.Warehouses) && featureCan(Features.Branches) && (
          <NavbarDivider />
        )}
        <FeatureCan feature={Features.Warehouses}>
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
        </FeatureCan>
      </NavbarGroup>
    </Navbar>
  );
}
