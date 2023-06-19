// @ts-nocheck
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

import { CLASSES } from '@/constants/classes';
import { DialogsName } from '@/constants/dialogs';

import { MenuItemNestedText, FormattedMessage as T } from '@/components';
import { nestedArrayToFlatten, filterAccountsByQuery } from '@/utils';

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

// Handle input value renderer.
const handleInputValueRenderer = (inputValue) => {
  if (inputValue) {
    return inputValue.name.toString();
  }
  return '';
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
  initialAccountId,
  selectedAccountId,
  defaultSelectText = intl.formatMessage({ id: 'select_account' }),
  popoverFill = false,
  onAccountSelected,

  filterByParentTypes = [],
  filterByTypes = [],
  filterByNormal,
  filterByRootTypes = [],

  allowCreate,

  ...suggestProps
}) {
  const flattenAccounts = useMemo(
    () => nestedArrayToFlatten(accounts),
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

  const handleAccountSelect = useCallback(
    (account) => {
      if (account.id) {
        setSelectedAccount({ ...account });
        onAccountSelected && onAccountSelected(account);
      } else {
        openDialog(DialogsName.AccountForm);
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
    <Suggest
      items={filteredAccounts}
      noResults={<MenuItem disabled={true} text={<T id={'no_accounts'} />} />}
      itemRenderer={accountItem}
      itemPredicate={filterAccountsPredicater}
      onItemSelect={handleAccountSelect}
      selectedItem={selectedAccount}
      inputProps={{ placeholder: defaultSelectText }}
      resetOnClose={true}
      fill={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
      inputValueRenderer={handleInputValueRenderer}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      {...suggestProps}
    />
  );
}

export const AccountsSuggestField = R.compose(withDialogActions)(
  AccountsSuggestFieldRoot,
);
