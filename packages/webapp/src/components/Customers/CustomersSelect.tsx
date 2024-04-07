// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { createNewItemFromQuery, createNewItemRenderer } from './utils';
import { FSelect } from '../Forms';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
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
  ...props
}) {
  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate ? createNewItemFromQuery : null;

  // Handles the create item click.
  const handleCreateItemClick = () => {
    openDrawer(DRAWERS.QUICK_CREATE_CUSTOMER);
  };

  return (
    <FSelect
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
