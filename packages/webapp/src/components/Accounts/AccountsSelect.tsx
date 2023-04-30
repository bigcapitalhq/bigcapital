// @ts-nocheck
import React, { useMemo } from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';
import {
  MenuItemNestedText,
  FormattedMessage as T,
  FSelect,
} from '@/components';
import { filterAccountsByQuery, nestedArrayToflatten } from '@/utils';
import { accountPredicate } from './_components';
import withDialogActions from '@/containers/Dialog/withDialogActions';

// Create new account renderer.
const createNewItemRenderer = (query, active, handleClick) => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      onClick={handleClick}
    />
  );
};

// Create new item from the given query string.
const createNewItemFromQuery = (name) => {
  return {
    name,
  };
};

/**
 * Default account item renderer.
 * @returns {JSX.Element}
 */
const accountRenderer = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={item.code}
      key={item.id}
      text={<MenuItemNestedText level={item.account_level} text={item.name} />}
      onClick={handleClick}
    />
  );
};

/**
 * Accounts select field binded with Formik form.
 * @returns {JSX.Element}
 */
function AccountsSelectRoot({
  // #withDialogActions
  openDialog,

  // #ownProps
  items,

  filterByParentTypes,
  filterByTypes,
  filterByNormal,
  filterByRootTypes,

  ...restProps
}) {
  // Filters accounts based on filter props.
  const filteredAccounts = useMemo(() => {
    const flattenAccounts = nestedArrayToflatten(items);

    const filteredAccounts = filterAccountsByQuery(flattenAccounts, {
      filterByRootTypes,
      filterByParentTypes,
      filterByTypes,
      filterByNormal,
    });
    return filteredAccounts;
  }, [
    items,
    filterByRootTypes,
    filterByParentTypes,
    filterByTypes,
    filterByNormal,
  ]);

  return (
    <FSelect
      items={filteredAccounts}
      textAccessor={'name'}
      labelAccessor={'code'}
      valueAccessor={'id'}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      itemPredicate={accountPredicate}
      itemRenderer={accountRenderer}
      {...restProps}
    />
  );
}

export const AccountsSelect = R.compose(withDialogActions)(AccountsSelectRoot);
