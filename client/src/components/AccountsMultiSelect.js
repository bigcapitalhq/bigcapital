import React, {useMemo, useCallback, useState} from 'react';
import {omit} from 'lodash';
import {
  MenuItem,
  Button
} from '@blueprintjs/core';
import MultiSelect from 'components/MultiSelect';
import { FormattedMessage as T } from 'react-intl';

export default function AccountsMultiSelect({
  accounts,
  onAccountSelected,
}) {
  const [selectedAccounts, setSelectedAccounts] = useState({}); 

  const isAccountSelect = useCallback((accountId) => {
    return 'undefined' !== typeof selectedAccounts[accountId];
  }, [selectedAccounts]);

  // Account item of select accounts field.
  const accountItem = useCallback((item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        icon={isAccountSelect(item.id) ? "tick" : "blank"}  
        text={item.name}
        label={item.code}
        key={item.id}
        onClick={handleClick} />
    );
  }, [isAccountSelect]);

  const countSelectedAccounts = useMemo(() => 
    Object.values(selectedAccounts).length,
    [selectedAccounts]);

  const onAccountSelect = useCallback((account) => {
    const selected = {
      ...(!isAccountSelect(account.id)) ? {
        ...selectedAccounts,
        [account.id]: true,
      } : {
        ...omit(selectedAccounts, [account.id])
      }
    };
    setSelectedAccounts({ ...selected });
    onAccountSelected && onAccountSelected(selected);
  }, [setSelectedAccounts, selectedAccounts, isAccountSelect, onAccountSelected]);

  return (
    <MultiSelect
      items={accounts}
      noResults={<MenuItem disabled={true} text='No results.' />}
      itemRenderer={accountItem}
      popoverProps={{ minimal: true }}
      filterable={true}
      onItemSelect={onAccountSelect}
    >
      <Button
        rightIcon='caret-down'
        text={countSelectedAccounts === 0 ?
         <T id={'all_accounts'}/>:
          `(${countSelectedAccounts}) Selected accounts`
        }
      />
    </MultiSelect>
  );
}