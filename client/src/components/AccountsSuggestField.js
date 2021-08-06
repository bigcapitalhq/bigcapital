import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import intl from 'react-intl-universal';

import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import { MenuItemNestedText, FormattedMessage as T } from 'components';
import { filterAccountsByQuery } from './utils';
import { nestedArrayToflatten } from 'utils';

/**
 * Accounts suggest field.
 */
export default function AccountsSuggestField({
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

  ...suggestProps
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

  // Filters accounts items.
  const filterAccountsPredicater = useCallback(
    (query, account, _index, exactMatch) => {
      const normalizedTitle = account.name.toLowerCase();
      const normalizedQuery = query.toLowerCase();

      if (exactMatch) {
        return normalizedTitle === normalizedQuery;
      } else {
        return (
          `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
        );
      }
    },
    [],
  );

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

  const handleInputValueRenderer = (inputValue) => {
    if (inputValue) {
      return inputValue.name.toString();
    }
    return '';
  };

  const onAccountSelect = useCallback(
    (account) => {
      setSelectedAccount({ ...account });
      onAccountSelected && onAccountSelected(account);
    },
    [setSelectedAccount, onAccountSelected],
  );

  return (
    <Suggest
      items={filteredAccounts}
      noResults={<MenuItem disabled={true} text={<T id={'no_accounts'} />} />}
      itemRenderer={accountItem}
      itemPredicate={filterAccountsPredicater}
      onItemSelect={onAccountSelect}
      selectedItem={selectedAccount}
      inputProps={{ placeholder: defaultSelectText }}
      resetOnClose={true}
      fill={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
      inputValueRenderer={handleInputValueRenderer}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      {...suggestProps}
    />
  );
}
