import React from 'react';
import AccountsSelectList from 'components/AccountsSelectList';
import classNames from 'classnames';
import {
  FormGroup,
  Classes,
} from '@blueprintjs/core';

// Account cell renderer.
const AccountCellRenderer = ({
  row: { index, original },
  payload: { accounts }
}) => {
  return (
    <FormGroup
      className={classNames('form-group--select-list',
        'form-group--account', Classes.FILL)}
      >
      <AccountsSelectList
        accounts={accounts}
        onAccountSelected={() => {}} />
    </FormGroup>
  );
};

export default AccountCellRenderer;