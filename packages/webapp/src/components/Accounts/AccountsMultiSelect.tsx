// @ts-nocheck
import React, { useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { FMultiSelect } from '../Forms';
import { accountPredicate } from './_components';
import { MenuItemNestedText } from '../Menu';
import { usePreprocessingAccounts } from './_hooks';

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
  // Filters accounts based on filter props.
  const filteredAccounts = usePreprocessingAccounts(accounts, {
    filterByParentTypes,
    filterByTypes,
    filterByNormal,
    filterByRootTypes,
  });

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
