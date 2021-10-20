import React from 'react';
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
import { CashFlowMenuItems } from './utils';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from '../../Settings/withSettings';
import withSettingsActions from '../../Settings/withSettingsActions';
import { addMoneyIn, addMoneyOut } from '../../../common/cashflowOptions';

import { compose } from 'utils';

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

  // Handle money in form
  const handleMoneyInFormTransaction = (value) => {
    openDialog('money-in', {
      account_type: value.type,
      account_id: accountId,
    });
  };

  // Handle money out form
  const handlMoneyOutFormTransaction = (value) => {
    openDialog('money-out', {
      account_type: value.type,
      account_id: accountId,
    });
  };

  const handleRefreshBtnClick = () => {};

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <CashFlowMenuItems
          items={addMoneyIn}
          onItemSelect={handleMoneyInFormTransaction}
          text={<T id={'cash_flow.label.add_money_in'} />}
          buttonProps={{
            icon: <Icon icon={'arrow-downward'} iconSize={20} />,
          }}
        />
        <CashFlowMenuItems
          items={addMoneyOut}
          onItemSelect={handlMoneyOutFormTransaction}
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
