import React, {useMemo, useCallback, useState} from 'react';
import {omit} from 'lodash';
import {
  MenuItem,
  Button
} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
// import MultiSelect from 'components/MultiSelect';

export default function AccountsMultiSelect({
  accounts,
  onAccountSelected,
}) {
  const [selectedAccount, setSelectedAccount] = useState(null); 

  // Account item of select accounts field.
  const accountItem = useCallback((item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={item.name}
        label={item.code}
        key={item.id}
        onClick={handleClick} />
    );
  }, []);

  const onAccountSelect = useCallback((account) => {
    setSelectedAccount({ ...account });
    onAccountSelected && onAccountSelected(account);
  }, [setSelectedAccount, onAccountSelected]);

  return (
    <Select
      items={accounts}
      noResults={<MenuItem disabled={true} text='No results.' />}
      itemRenderer={accountItem}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={onAccountSelect}
    >
      <Button
        rightIcon='caret-down'
        text={selectedAccount ? selectedAccount.name : 'Select account'}
      />
    </Select>
  );
}