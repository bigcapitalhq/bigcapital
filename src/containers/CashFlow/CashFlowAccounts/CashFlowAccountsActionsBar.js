import React from 'react';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
  Switch,
} from '@blueprintjs/core';
import {
  Icon,
  FormattedMessage as T,
} from 'components';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from '../../Settings/withSettings';
import withSettingsActions from '../../Settings/withSettingsActions';
import withCashflowAccountsTableActions from '../AccountTransactions/withCashflowAccountsTableActions';

import { compose } from 'utils';

/**
 * Cash Flow accounts actions bar.
 */
function CashFlowAccountsActionsBar({
  // #withDialogActions
  openDialog,

  // #withSettings
  cashflowTableSize,

  // #withSettingsActions
  addSetting,

  // #
  setCashflowAccountsTableState
}) {
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('cashflowAccounts', 'tableSize', size);
  };
  // Handle click a refresh
  const handleRefreshBtnClick = () => {};

  // Handle add bank account.
  const handleAddBankAccount = () => {
    openDialog('account-form', {});
  };
  // Handle add cash account.
  const handleAddCashAccount = () => {
    openDialog('account-form', {});
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
  withSettingsActions,
  withSettings(({ cashflowSettings }) => ({
    cashflowTableSize: cashflowSettings?.tableSize,
  })),
  withCashflowAccountsTableActions,
)(CashFlowAccountsActionsBar);
