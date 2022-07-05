import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import * as R from 'ramda';
import classNames from 'classnames';
import intl from 'react-intl-universal'

import { MenuItemNestedText, FormattedMessage as T } from '@/components';
import { filterAccountsByQuery } from './utils';
import { nestedArrayToflatten } from '@/utils';
import { CLASSES } from '@/common/classes';

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
 * Accounts select list.
 */
function AccountsSelectList({
  // #withDialogActions
  openDialog,

  // #ownProps
  accounts,
  initialAccountId,
  selectedAccountId,
  defaultSelectText = 'Select account',
  onAccountSelected,
  disabled = false,
  popoverFill = false,

  filterByParentTypes,
  filterByTypes,
  filterByNormal,
  filterByRootTypes,

  allowCreate,

  buttonProps = {},
}) {
  const flattenAccounts = useMemo(
    () => nestedArrayToflatten(accounts),
    [accounts],
  );

  // Filters accounts based on filter props.
  const filteredAccounts = useMemo(() => {
    let filteredAccounts = filterAccountsByQuery(flattenAccounts, {
      filterByRootTypes,
      filterByParentTypes,
      filterByTypes,
      filterByNormal,
    });
    return filteredAccounts;
  }, [
    flattenAccounts,
    filterByRootTypes,
    filterByParentTypes,
    filterByTypes,
    filterByNormal,
  ]);

  // Find initial account object to set it as default account in initial render.
  const initialAccount = useMemo(
    () => filteredAccounts.find((a) => a.id === initialAccountId),
    [initialAccountId, filteredAccounts],
  );

  // Select account item.
  const [selectedAccount, setSelectedAccount] = useState(
    initialAccount || null,
  );

  useEffect(() => {
    if (typeof selectedAccountId !== 'undefined') {
      const account = selectedAccountId
        ? filteredAccounts.find((a) => a.id === selectedAccountId)
        : null;
      setSelectedAccount(account);
    }
  }, [selectedAccountId, filteredAccounts, setSelectedAccount]);

  // Account item of select accounts field.
  const accountItem = useCallback((item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={<MenuItemNestedText level={item.level} text={item.name} />}
        label={item.code}
        key={item.id}
        onClick={handleClick}
      />
    );
  }, []);

  // Handle the account item select.
  const handleAccountSelect = useCallback(
    (account) => {
      if (account.id) {
        setSelectedAccount({ ...account });
        onAccountSelected && onAccountSelected(account);
      } else {
        openDialog('account-form');
      }
    },
    [setSelectedAccount, onAccountSelected, openDialog],
  );

  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  return (
    <Select
      items={filteredAccounts}
      noResults={<MenuItem disabled={true} text={<T id={'no_accounts'} />} />}
      itemRenderer={accountItem}
      itemPredicate={filterAccountsPredicater}
      popoverProps={{
        minimal: true,
        usePortal: !popoverFill,
        inline: popoverFill,
      }}
      filterable={true}
      onItemSelect={handleAccountSelect}
      disabled={disabled}
      className={classNames('form-group--select-list', {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
    >
      <Button
        disabled={disabled}
        text={selectedAccount ? selectedAccount.name : defaultSelectText}
        {...buttonProps}
      />
    </Select>
  );
}

export default R.compose(withDialogActions)(AccountsSelectList);
