// @ts-nocheck
import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { FMultiSelect } from '../Forms';
import { accountPredicate } from './_components';
import { MenuItemNestedText } from '../Menu';
import { usePreprocessingAccounts } from './_hooks';

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

// Create new item from the given query string.
const createNewItemFromQuery = (name) => ({ name });

/**
 * Accounts multi-select field bound with Formik form.
 * @returns {JSX.Element}
 */
export function AccountsMultiSelect({
  items,
  allowCreate,

  filterByRootTypes,
  filterByParentTypes,
  filterByTypes,
  filterByNormal,

  ...rest
}) {
  // Filters accounts based on filter props.
  const filteredAccounts = usePreprocessingAccounts(items, {
    filterByParentTypes,
    filterByTypes,
    filterByNormal,
    filterByRootTypes,
  });
  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  // Handles the create item click.
  const handleCreateItemClick = () => {
    openDialog(DialogsName.AccountForm);
  };

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
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
      {...rest}
    />
  );
}
