import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { isEmpty } from 'lodash';

import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import { FormattedMessage as T } from 'react-intl';

export default function AccountsSuggestField({
  accounts,
  initialAccountId,
  selectedAccountId,
  defaultSelectText = 'Select account',
  onAccountSelected,

  filterByRootTypes = [],
  filterByTypes = [],
  filterByNormal,
  popoverFill = false,

  ...suggestProps
}) {
  // Filters accounts based on filter props.
  const filteredAccounts = useMemo(() => {
    let filteredAccounts = [...accounts];

    if (!isEmpty(filterByRootTypes)) {
      filteredAccounts = filteredAccounts.filter(
        (account) => filterByRootTypes.indexOf(account.type.root_type) !== -1,
      );
    }
    if (!isEmpty(filterByTypes)) {
      filteredAccounts = filteredAccounts.filter(
        (account) => filterByTypes.indexOf(account.type.key) !== -1,
      );
    }
    if (!isEmpty(filterByNormal)) {
      filteredAccounts = filteredAccounts.filter(
        (account) =>
          filterByTypes.indexOf(account.type.normal) === filterByNormal,
      );
    }
    return filteredAccounts;
  }, [accounts, filterByRootTypes, filterByTypes, filterByNormal]);

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
        text={item.htmlName || item.name}
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
      popoverProps={{ minimal: true }}
      {...suggestProps}
      inputValueRenderer={handleInputValueRenderer}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
    />
  );
}
