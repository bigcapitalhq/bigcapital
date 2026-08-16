import { MenuItem } from '@blueprintjs/core';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import { FMultiSelect } from '../Forms';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { Customer, Vendor } from '@bigcapital/sdk-ts';
import type { SelectOptionProps } from '@blueprintjs-formik/select';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

export interface ContactSelectModel
  extends Partial<Customer>,
    Partial<Vendor>,
    SelectOptionProps {}

type FMultiSelectProps = React.ComponentProps<typeof FMultiSelect>;

export interface ContactsMultiSelectProps
  extends Omit<FMultiSelectProps, 'items'> {
  items: ContactSelectModel[];
  allowCreate?: boolean;
}

// Create new contact renderer.
const createNewItemRenderer = (
  query: string,
  active: boolean,
  handleClick: React.MouseEventHandler<HTMLElement>,
): React.ReactElement => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      onClick={handleClick}
    />
  );
};

// Create new contact from the given query string.
const createNewItemFromQuery = (query: string): ContactSelectModel => ({
  id: 0,
  displayName: query,
  value: query,
  text: query,
  label: query,
});

/**
 * Contacts multi-select component.
 */
export function ContactsMultiSelect({
  allowCreate,
  ...multiSelectProps
}: ContactsMultiSelectProps): React.ReactElement {
  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate
    ? createNewItemRenderer
    : undefined;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : undefined;

  return (
    <FMultiSelect<ContactSelectModel>
      valueAccessor={'id'}
      textAccessor={'displayName'}
      tagAccessor={'displayName'}
      popoverProps={{ minimal: true }}
      fill={true}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      {...multiSelectProps}
    />
  );
}

interface CustomersMultiSelectRootProps
  extends ContactsMultiSelectProps,
    WithDrawerActionsProps {}

/**
 * Customers multi-select component.
 */
function CustomersMultiSelectRoot({
  // #withDrawerAction
  openDrawer,
  closeDrawer,
  ...props
}: CustomersMultiSelectRootProps): React.ReactElement {
  const handleCreateItemClick = () => {
    openDrawer(DRAWERS.QUICK_CREATE_CUSTOMER);
  };
  return (
    <ContactsMultiSelect
      onCreateItemSelect={handleCreateItemClick}
      {...props}
    />
  );
}

interface VendorsMultiSelectRootProps
  extends ContactsMultiSelectProps,
    WithDrawerActionsProps {}

/**
 * Vendors multi-select component.
 */
function VendorsMultiSelectRoot({
  // #withDrawerAction
  openDrawer,
  closeDrawer,
  ...props
}: VendorsMultiSelectRootProps): React.ReactElement {
  const handleCreateItemClick = () => {
    openDrawer(DRAWERS.QUICK_WRITE_VENDOR);
  };
  return (
    <ContactsMultiSelect
      onCreateItemSelect={handleCreateItemClick}
      {...props}
    />
  );
}

export const CustomersMultiSelect = R.compose(withDrawerActions)(
  CustomersMultiSelectRoot,
);

export const VendorsMultiSelect = R.compose(withDrawerActions)(
  VendorsMultiSelectRoot,
);
