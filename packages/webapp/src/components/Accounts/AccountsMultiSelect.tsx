// @ts-nocheck
import React, { useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { FMultiSelect } from '../Forms';
import { accountPredicate } from './_components';
import { filterAccountsByQuery, nestedArrayToflatten } from '@/utils';
import { MenuItemNestedText } from '../Menu';

/**
 * Default account item renderer of the list.
 * @returns {JSX.Element}
 */
const accountRenderer = (
  item,
  { handleClick, modifiers, query },
  { isSelected },
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      text={<MenuItemNestedText level={item.account_level} text={item.name} />}
      key={item.id}
      onClick={handleClick}
      icon={isSelected ? 'tick' : 'blank'}
    />
  );
};

/**
 * Accounts multi-select field binded with Formik form.
 * @param {*} param0
 * @returns {JSX.Element}
 */
export function AccountsMultiSelect({
  items,

  filterByRootTypes,
  filterByParentTypes,
  filterByTypes,
  filterByNormal,

  ...rest
}) {
  // Filters accounts based on the given filter props.
  const filteredAccounts = useMemo(() => {
    const flattenAccounts = nestedArrayToflatten(items);

    return filterAccountsByQuery(flattenAccounts, {
      filterByRootTypes,
      filterByParentTypes,
      filterByTypes,
      filterByNormal,
    });
  }, [
    items,
    filterByRootTypes,
    filterByParentTypes,
    filterByTypes,
    filterByNormal,
  ]);

  return (
    <FMultiSelect
      items={filteredAccounts}
      valueAccessor={'id'}
      textAccessor={'name'}
      labelAccessor={'code'}
      tagAccessor={'name'}
      popoverProps={{ minimal: true }}
      itemPredicate={accountPredicate}
      itemRenderer={accountRenderer}
      {...rest}
    />
  );
}
