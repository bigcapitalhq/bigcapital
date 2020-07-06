import React, { useCallback, useMemo } from 'react';
import AccountsSelectList from 'components/AccountsSelectList';
import classNames from 'classnames';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';

// Account cell renderer.
const AccountCellRenderer = ({
  column: { id, accountsDataProp },
  row: { index, original },
  cell: { value: initialValue },
  payload: { accounts: defaultAccounts, updateData, errors, ...restProps },
}) => {
  const handleAccountSelected = useCallback(
    (account) => {
      updateData(index, id, account.id);
    },
    [updateData, index, id],
  );
  const error = errors?.[index]?.[id];

  const accounts = useMemo(
    () => restProps[accountsDataProp] || defaultAccounts,
    [restProps, defaultAccounts, accountsDataProp],
  );
  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(
        'form-group--select-list',
        'form-group--account',
        Classes.FILL,
      )}
    >
      <AccountsSelectList
        accounts={accounts}
        onAccountSelected={handleAccountSelected}
        selectedAccountId={initialValue}
      />
    </FormGroup>
  );
};

export default AccountCellRenderer;
