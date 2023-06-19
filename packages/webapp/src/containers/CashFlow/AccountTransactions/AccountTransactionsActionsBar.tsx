// @ts-nocheck
import React, { useMemo } from 'react';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
} from '@blueprintjs/core';
import {
  Icon,
  DashboardActionsBar,
  DashboardRowsHeightButton,
  FormattedMessage as T,
} from '@/components';

import { CashFlowMenuItems } from './utils';
import {
  getAddMoneyOutOptions,
  getAddMoneyInOptions,
} from '@/constants/cashflowOptions';
import { useRefreshCashflowTransactionsInfinity } from '@/hooks/query';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';

import { compose } from '@/utils';

function AccountTransactionsActionsBar({
  // #withDialogActions
  openDialog,

  // #withSettings
  cashflowTansactionsTableSize,

  // #withSettingsActions
  addSetting,
}) {
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('cashflowTransactions', 'tableSize', size);
  };
  const { accountId } = useAccountTransactionsContext();

  // Retrieves the money in/out buttons options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);
  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  // Handle money in form
  const handleMoneyInFormTransaction = (account) => {
    openDialog('money-in', {
      account_id: accountId,
      account_type: account.value,
      account_name: account.name,
    });
  };
  // Handle money out form
  const handleMoneyOutFormTransaction = (account) => {
    openDialog('money-out', {
      account_id: accountId,
      account_type: account.value,
      account_name: account.name,
    });
  };
  // Refresh cashflow infinity transactions hook.
  const { refresh } = useRefreshCashflowTransactionsInfinity();

  // Handle the refresh button click.
  const handleRefreshBtnClick = () => {
    refresh();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <CashFlowMenuItems
          items={addMoneyInOptions}
          onItemSelect={handleMoneyInFormTransaction}
          text={<T id={'cash_flow.label.add_money_in'} />}
          buttonProps={{
            icon: <Icon icon={'arrow-downward'} iconSize={20} />,
          }}
        />
        <CashFlowMenuItems
          items={addMoneyOutOptions}
          onItemSelect={handleMoneyOutFormTransaction}
          text={<T id={'cash_flow.label.add_money_out'} />}
          buttonProps={{
            icon: <Icon icon={'arrow-upward'} iconSize={20} />,
          }}
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
          initialValue={cashflowTansactionsTableSize}
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
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
)(AccountTransactionsActionsBar);
