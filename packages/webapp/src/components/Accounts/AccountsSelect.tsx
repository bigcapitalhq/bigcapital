// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';
import { MenuItemNestedText, FSelect } from '@/components';
import { accountPredicate } from './_components';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';
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

// Create new item from the given query string.
const createNewItemFromQuery = (name) => ({ name });

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
 * Accounts select field bound with Formik form.
 * @returns {JSX.Element}
 */
function AccountsSelectRoot({
  // #withDialogActions
  openDialog,

  // #ownProps
  items,
  allowCreate,

  filterByParentTypes,
  filterByTypes,
  filterByNormal,
  filterByRootTypes,

  ...restProps
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
    <FSelect
      items={filteredAccounts}
      textAccessor={'name'}
      labelAccessor={'code'}
      valueAccessor={'id'}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      itemPredicate={accountPredicate}
      itemRenderer={accountRenderer}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
      {...restProps}
    />
  );
}

export const AccountsSelect = R.compose(withDialogActions)(AccountsSelectRoot);
