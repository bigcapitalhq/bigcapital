// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { MenuItem } from '@blueprintjs/core';

import { CLASSES } from '@/constants/classes';
import { DialogsName } from '@/constants/dialogs';

import {
  FSuggest,
  MenuItemNestedText,
  FormattedMessage as T,
} from '@/components';
import { nestedArrayToflatten, filterAccountsByQuery } from '@/utils';
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
  return { name };
};

// Filters accounts items.
const filterAccountsPredicater = (query, account, _index, exactMatch) => {
  const normalizedTitle = account.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

/**
 * Accounts suggest field.
 */
function AccountsSuggestFieldRoot({
  // #withDialogActions
  openDialog,

  // #ownProps
  accounts,
  defaultSelectText = intl.formatMessage({ id: 'select_account' }),

  filterByParentTypes = [],
  filterByTypes = [],
  filterByNormal,
  filterByRootTypes = [],

  allowCreate,

  ...suggestProps
}) {
  const flattenAccounts = useMemo(
    () => nestedArrayToflatten(accounts),
    [accounts],
  );
  const filteredAccounts = useMemo(
    () =>
      filterAccountsByQuery(flattenAccounts, {
        filterByParentTypes,
        filterByTypes,
        filterByNormal,
        filterByRootTypes,
      }),
    [
      flattenAccounts,
      filterByParentTypes,
      filterByTypes,
      filterByNormal,
      filterByRootTypes,
    ],
  );
  const handleCreateItemSelect = useCallback(
    (item) => {
      if (!item.id) {
        openDialog(DialogsName.AccountForm);
      }
    },
    [openDialog],
  );
  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  return (
    <FSuggest
      items={filteredAccounts}
      itemPredicate={filterAccountsPredicater}
      onCreateItemSelect={handleCreateItemSelect}
      valueAccessor="id"
      textAccessor="name"
      labelAccessor="code"
      inputProps={{ placeholder: defaultSelectText }}
      resetOnClose
      popoverProps={{ minimal: true, boundary: 'window' }}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      {...suggestProps}
    />
  );
}

export const AccountsSuggestField = R.compose(withDialogActions)(
  AccountsSuggestFieldRoot,
);
