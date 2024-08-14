// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { useFormikContext } from 'formik';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { createNewItemFromQuery, createNewItemRenderer } from './utils';
import { FSelect } from '../Forms';
import { useCreateAutofillListener } from '@/hooks/state/autofill';
import { DRAWERS } from '@/constants/drawers';

/**
 * Vendor select.
 * @returns {React.ReactNode}
 */
function VendorsSelectRoot({
  // #withDrawerActions
  openDrawer,

  // #ownProps
  name,
  items,
  allowCreate,

  ...restProps
}) {
  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;
  const { setFieldValue } = useFormikContext();

  // Creates a new autofill listener once the quick vendor drawer submits the form.
  const autofillRef = useCreateAutofillListener((payload: any) => {
    setFieldValue(name, payload.vendorId);
  });

  // Handles the create item click.
  const handleCreateItemClick = (item) => {
    openDrawer(DRAWERS.QUICK_WRITE_VENDOR, {
      autofillRef,
      displayName: item.name,
    });
  };

  return (
    <FSelect
      name={name}
      items={items}
      textAccessor={'display_name'}
      labelAccessor={'formatted_balance'}
      valueAccessor={'id'}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
      {...restProps}
    />
  );
}

export const VendorsSelect = R.compose(withDrawerActions)(VendorsSelectRoot);
