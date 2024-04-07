// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { createNewItemFromQuery, createNewItemRenderer } from './utils';
import { FSelect } from '../Forms';
import { DRAWERS } from '@/constants/drawers';

/**
 * Vendor select.
 * @returns {React.ReactNode}
 */
function VendorsSelectRoot({
  // #withDrawerActions
  openDrawer,

  // #ownProps
  items,
  allowCreate,

  ...restProps
}) {
  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate ? createNewItemFromQuery : null;

  // Handles the create item click.
  const handleCreateItemClick = () => {
    openDrawer(DRAWERS.QUICK_WRITE_VENDOR);
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
      {...restProps}
    />
  );
}

export const VendorsSelect = R.compose(withDrawerActions)(VendorsSelectRoot);
