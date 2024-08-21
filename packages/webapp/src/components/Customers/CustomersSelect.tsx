// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { useFormikContext } from 'formik';
import { createNewItemFromQuery, createNewItemRenderer } from './utils';
import { FSelect } from '../Forms';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { useCreateAutofillListener } from '@/hooks/state/autofill';
import { DRAWERS } from '@/constants/drawers';

/**
 * Customer select field.
 * @returns {React.ReactNode}
 */
function CustomerSelectRoot({
  // #withDrawerActions
  openDrawer,

  // #ownProps
  items,
  allowCreate,
  name,
  ...props
}) {
  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;
  const { setFieldValue } = useFormikContext();

  // Creates autofill listener once the quick customer drawer submit the form.
  const autofillRef = useCreateAutofillListener((payload: any) => {
    setFieldValue(name, payload.customerId);
  });
  // Handles the create item click.
  const handleCreateItemClick = (item) => {
    const displayName = item.name;
    openDrawer(DRAWERS.QUICK_CREATE_CUSTOMER, { autofillRef, displayName });
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
      {...props}
    />
  );
}

export const CustomersSelect = R.compose(withDrawerActions)(CustomerSelectRoot);
