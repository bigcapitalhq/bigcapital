import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { FormattedMessage as T } from 'react-intl';

export default function AccountsSelectList({
  accounts,
  initialAccountId,
  selectedAccountId,
  defaultSelectText = 'Select account',
  onAccountSelected,
  disabled = false,
}) {
  // Find initial account object to set it as default account in initial render.
  const initialAccount = useMemo(
    () => accounts.find((a) => a.id === initialAccountId),
    [initialAccountId],
  );

  const [selectedAccount, setSelectedAccount] = useState(
    initialAccount || null,
  );

  useEffect(() => {
    if (typeof selectedAccountId !== 'undefined') {
      const account = selectedAccountId
        ? accounts.find((a) => a.id === selectedAccountId)
        : null;
      setSelectedAccount(account);
    }
  }, [selectedAccountId, accounts, setSelectedAccount]);

  // Account item of select accounts field.
  const accountItem = useCallback((item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={item.name}
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
      items={accounts}
      noResults={<MenuItem disabled={true} text={<T id={'no_accounts'} />} />}
      itemRenderer={accountItem}
      itemPredicate={filterAccountsPredicater}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={onAccountSelect}
    >
      <Button
        disabled={disabled}
        text={selectedAccount ? selectedAccount.name : defaultSelectText}
      />
    </Select>
  );
}
