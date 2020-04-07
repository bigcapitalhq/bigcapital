import React, {useCallback} from 'react';
import AccountsSelectList from 'components/AccountsSelectList';
import classNames from 'classnames';
import {
  FormGroup,
  Classes,
  Intent,
} from '@blueprintjs/core';

// Account cell renderer.
const AccountCellRenderer = ({
  column: { id, value },
  row: { index, original },
  payload: { accounts, updateData, errors },
}) => {
  const handleAccountSelected = useCallback((account) => {
    updateData(index, id, account.id);
  }, [updateData, index, id]);

  const { account_id = false } = (errors[index] || {});

  return (
    <FormGroup
      intent={account_id ? Intent.DANGER : ''}
      className={classNames(
        'form-group--select-list',
        'form-group--account',
        Classes.FILL)}
      >
      <AccountsSelectList
        accounts={accounts}
        onAccountSelected={handleAccountSelected}
        error={account_id} />
    </FormGroup>
  );
};

export default AccountCellRenderer;