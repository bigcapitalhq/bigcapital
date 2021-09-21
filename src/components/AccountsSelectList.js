import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { MenuItemNestedText, FormattedMessage as T } from 'components';
import classNames from 'classnames';
import { filterAccountsByQuery } from './utils';
import { nestedArrayToflatten } from 'utils';
import { CLASSES } from 'common/classes';

export default function AccountsSelectList({
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

  const onAccountSelect = useCallback(
    (account) => {
      setSelectedAccount({ ...account });
      onAccountSelected && onAccountSelected(account);
    },
    [setSelectedAccount, onAccountSelected],
  );

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
      onItemSelect={onAccountSelect}
      disabled={disabled}
      className={classNames('form-group--select-list', {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
    >
      <Button
        disabled={disabled}
        text={selectedAccount ? selectedAccount.name : defaultSelectText}
        {...buttonProps}
      />
    </Select>
  );
}
