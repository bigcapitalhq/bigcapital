import React from 'react';
import { Button, AnchorButton, Classes, Icon } from '@blueprintjs/core';

export default function ExpensesActionsBar() {
  const onClickNewAccount = () => {};

  return (
    <div class='dashboard__actions-bar'>
      <AnchorButton
        className={Classes.MINIMAL}
        icon={<Icon icon='plus' />}
        href='/dashboard/expenses/new'
        text='New Expense'
        onClick={onClickNewAccount}
      />

      <Button
        className={Classes.MINIMAL}
        icon={<Icon icon='plus' />}
        text='Delete Expense'
        onClick={onClickNewAccount}
      />

      <Button
        className={Classes.MINIMAL}
        icon={<Icon icon='plus' />}
        text='Bulk Update'
        onClick={onClickNewAccount}
      />
    </div>
  );
}
