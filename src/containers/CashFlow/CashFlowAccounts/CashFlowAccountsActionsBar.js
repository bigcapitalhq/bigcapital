import React from 'react';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
  Switch,
} from '@blueprintjs/core';
import { Icon, FormattedMessage as T } from 'components';
import { useRefreshCashflowAccounts } from 'hooks/query';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withCashflowAccountsTableActions from '../AccountTransactions/withCashflowAccountsTableActions';

import { compose } from 'utils';

/**
 * Cash Flow accounts actions bar.
 */
function CashFlowAccountsActionsBar({
  // #withDialogActions
  openDialog,

  // #withCashflowAccountsTableActions
  setCashflowAccountsTableState,
}) {
  const { refresh } = useRefreshCashflowAccounts();

  // Handle refresh button click.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle add bank account.
  const handleAddBankAccount = () => {
    openDialog('account-form', {
      action: 'NEW_ACCOUNT_DEFINED_TYPE',
      accountType: 'cash',
    });
  };
  // Handle add cash account.
  const handleAddCashAccount = () => {
    openDialog('account-form', {
      action: 'NEW_ACCOUNT_DEFINED_TYPE',
      accountType: 'bank',
    });
  };
  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (event) => {
    const checked = event.target.checked;
    setCashflowAccountsTableState({ inactiveMode: checked });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus-24'} iconSize={20} />}
          text={<T id={'cash_flow.label.add_cash_account'} />}
          onClick={handleAddBankAccount}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus-24'} iconSize={20} />}
          text={<T id={'cash_flow.label.add_bank_account'} />}
          onClick={handleAddCashAccount}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <NavbarDivider />

        <Switch
          labelElement={<T id={'inactive'} />}
          defaultChecked={false}
          onChange={handleInactiveSwitchChange}
        />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
export default compose(
  withDialogActions,
  withCashflowAccountsTableActions,
)(CashFlowAccountsActionsBar);
