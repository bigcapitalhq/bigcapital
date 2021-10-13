import React from 'react';
import classNames from 'classnames';

import { isEmpty } from 'lodash';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
} from '@blueprintjs/core';

import {
  Icon,
  DashboardRowsHeightButton,
  FormattedMessage as T,
} from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from '../../Settings/withSettings';
import withSettingsActions from '../../Settings/withSettingsActions';

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

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          // className={classNames(Classes.MINIMAL, 'button--table-views')}
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
        <DashboardRowsHeightButton
          initialValue={cashflowTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
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
)(CashFlowAccountsActionsBar);
