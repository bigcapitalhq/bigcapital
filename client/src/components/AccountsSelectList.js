import React, { useCallback, useState } from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

export default function AccountsSelectList({
  accounts,
  onAccountSelected,
  error = [],
  initialAccount,
  defautlSelectText = 'Select account',
}) {
  const [selectedAccount, setSelectedAccount] = useState(
    initialAccount || null,
  );
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

  return (
    <Select
      items={accounts}
      noResults={<MenuItem disabled={true} text="No results." />}
      itemRenderer={accountItem}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={onAccountSelect}
    >
      <Button
        text={selectedAccount ? selectedAccount.name : defautlSelectText}
      />
    </Select>
  );
}
