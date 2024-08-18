// @ts-nocheck
import React, { useMemo } from 'react';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
  Popover,
  Menu,
  MenuItem,
  PopoverInteractionKind,
  Position,
  Intent,
  Switch,
  Tooltip,
  MenuDivider,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import {
  Icon,
  DashboardActionsBar,
  DashboardRowsHeightButton,
  FormattedMessage as T,
  AppToaster,
  If,
} from '@/components';

import { CashFlowMenuItems } from './utils';
import {
  getAddMoneyOutOptions,
  getAddMoneyInOptions,
} from '@/constants/cashflowOptions';
import { useRefreshCashflowTransactions } from '@/hooks/query';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';

import { compose } from '@/utils';
import {
  useUpdateBankAccount,
  useExcludeUncategorizedTransactions,
  useUnexcludeUncategorizedTransactions,
} from '@/hooks/query/bank-rules';
import { withBankingActions } from '../withBankingActions';
import { withBanking } from '../withBanking';
import withAlertActions from '@/containers/Alert/withAlertActions';
import { DialogsName } from '@/constants/dialogs';

function AccountTransactionsActionsBar({
  // #withDialogActions
  openDialog,

  // #withSettings
  cashflowTansactionsTableSize,

  // #withSettingsActions
  addSetting,

  // #withBanking
  uncategorizedTransationsIdsSelected,
  excludedTransactionsIdsSelected,
  openMatchingTransactionAside,
  categorizedTransactionsSelected,

  // #withBankingActions
  enableMultipleCategorization,

  // #withAlerts
  openAlert,
}) {
  const history = useHistory();
  const { accountId, currentAccount } = useAccountTransactionsContext();

  // Refresh cashflow infinity transactions hook.
  const { refresh } = useRefreshCashflowTransactions();

  const { mutateAsync: updateBankAccount } = useUpdateBankAccount();

  // Retrieves the money in/out buttons options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);
  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  const isFeedsActive = !!currentAccount.is_feeds_active;
  const isFeedsPaused = currentAccount.is_feeds_paused;
  const isSyncingOwner = currentAccount.is_syncing_owner;

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('cashflowTransactions', 'tableSize', size);
  };
  // Handle money in form
  const handleMoneyInFormTransaction = (account) => {
    openDialog('money-in', {
      account_id: accountId,
      account_type: account.value,
      account_name: account.name,
    });
  };
  // Handle money out form
  const handlMoneyOutFormTransaction = (account) => {
    openDialog('money-out', {
      account_id: accountId,
      account_type: account.value,
      account_name: account.name,
    });
  };
  // Handle import button click.
  const handleImportBtnClick = () => {
    history.push(`/cashflow-accounts/${accountId}/import`);
  };
  // Handle bank rules click.
  const handleBankRulesClick = () => {
    history.push(`/bank-rules?accountId=${accountId}`);
  };

  // Handles the bank account disconnect click.
  const handleDisconnectClick = () => {
    openDialog(DialogsName.DisconnectBankAccountConfirmation, {
      bankAccountId: accountId,
    });
  };
  // handles the bank update button click.
  const handleBankUpdateClick = () => {
    updateBankAccount({ bankAccountId: accountId })
      .then(() => {
        AppToaster.show({
          message: 'The transactions of the bank account has been updated.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };
  // Handle the refresh button click.
  const handleRefreshBtnClick = () => {
    refresh(accountId);
  };

  const {
    mutateAsync: excludeUncategorizedTransactions,
    isLoading: isExcludingLoading,
  } = useExcludeUncategorizedTransactions();

  const {
    mutateAsync: unexcludeUncategorizedTransactions,
    isLoading: isUnexcludingLoading,
  } = useUnexcludeUncategorizedTransactions();

  // Handles the exclude uncategorized transactions in bulk.
  const handleExcludeUncategorizedBtnClick = () => {
    excludeUncategorizedTransactions({
      ids: uncategorizedTransationsIdsSelected,
    })
      .then(() => {
        AppToaster.show({
          message: 'The selected transactions have been excluded.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong',
          intent: Intent.DANGER,
        });
      });
  };

  // Handles the unexclude categorized button click.
  const handleUnexcludeUncategorizedBtnClick = () => {
    unexcludeUncategorizedTransactions({
      ids: excludedTransactionsIdsSelected,
    })
      .then(() => {
        AppToaster.show({
          message: 'The selected excluded transactions have been unexcluded.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {
        AppToaster.show({
          message: 'Something went wrong',
          intent: Intent.DANGER,
        });
      });
  };

  // Handle multi select transactions for categorization or matching.
  const handleMultipleCategorizingSwitch = (event) => {
    enableMultipleCategorization(event.currentTarget.checked);
  };
  // Handle resume bank feeds syncing.
  const handleResumeFeedsSyncing = () => {
    openAlert('resume-feeds-syncing-bank-accounnt', {
      bankAccountId: accountId,
    });
  };
  // Handles pause bank feeds syncing.
  const handlePauseFeedsSyncing = () => {
    openAlert('pause-feeds-syncing-bank-accounnt', {
      bankAccountId: accountId,
    });
  };
  // Handles uncategorize the categorized transactions in bulk.
  const handleUncategorizeCategorizedBulkBtnClick = () => {
    openAlert('uncategorize-transactions-bulk', {
      uncategorizeTransactionsIds: categorizedTransactionsSelected,
    });
  };
  // Handles the delete account button click.
  const handleDeleteAccountClick = () => {
    openAlert('account-delete', {
      accountId,
    });
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
          onClick={handleImportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={cashflowTansactionsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />

        <If condition={isSyncingOwner}>
          <Tooltip
            content={
              isFeedsActive
                ? isFeedsPaused
                  ? 'The bank syncing is paused'
                  : 'The bank syncing is active'
                : 'The bank syncing is disconnected'
            }
            minimal={true}
            position={Position.BOTTOM}
          >
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon="feed" iconSize={16} />}
              intent={
                isFeedsActive
                  ? isFeedsPaused
                    ? Intent.WARNING
                    : Intent.SUCCESS
                  : Intent.DANGER
              }
            />
          </Tooltip>
        </If>

        {!isEmpty(uncategorizedTransationsIdsSelected) && (
          <Button
            icon={<Icon icon="disable" iconSize={16} />}
            text={'Exclude'}
            onClick={handleExcludeUncategorizedBtnClick}
            className={Classes.MINIMAL}
            intent={Intent.DANGER}
            disabled={isExcludingLoading}
          />
        )}
        {!isEmpty(excludedTransactionsIdsSelected) && (
          <Button
            icon={<Icon icon="disable" iconSize={16} />}
            text={'Unexclude'}
            onClick={handleUnexcludeUncategorizedBtnClick}
            className={Classes.MINIMAL}
            intent={Intent.DANGER}
            disabled={isUnexcludingLoading}
          />
        )}
        {!isEmpty(categorizedTransactionsSelected) && (
          <Button
            text={'Uncategorize'}
            onClick={handleUncategorizeCategorizedBulkBtnClick}
            intent={Intent.DANGER}
            minimal
          />
        )}
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        {openMatchingTransactionAside && (
          <Tooltip
            content={
              'Enables to categorize or matching multiple bank transactions into one transaction.'
            }
            position={Position.BOTTOM}
            minimal
          >
            <Switch
              label={'Multi Select'}
              inline
              onChange={handleMultipleCategorizingSwitch}
            />
          </Tooltip>
        )}
        <NavbarDivider />
        <Popover
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_RIGHT}
          modifiers={{
            offset: { offset: '0, 4' },
          }}
          content={
            <Menu>
              <If condition={isSyncingOwner && isFeedsActive}>
                <MenuItem onClick={handleBankUpdateClick} text={'Update'} />
                <MenuDivider />
              </If>

              <If condition={isSyncingOwner && isFeedsActive && !isFeedsPaused}>
                <MenuItem
                  onClick={handlePauseFeedsSyncing}
                  text={'Pause bank feeds'}
                />
                <MenuDivider />
              </If>

              <If condition={isSyncingOwner && isFeedsActive && isFeedsPaused}>
                <MenuItem
                  onClick={handleResumeFeedsSyncing}
                  text={'Resume bank feeds'}
                />
                <MenuDivider />
              </If>

              <MenuItem onClick={handleBankRulesClick} text={'Bank rules'} />

              <MenuDivider />
              <If condition={isSyncingOwner && isFeedsActive}>
                <MenuItem
                  intent={Intent.DANGER}
                  onClick={handleDisconnectClick}
                  text={'Disconnect'}
                />
              </If>
              <MenuItem
                intent={Intent.DANGER}
                onClick={handleDeleteAccountClick}
                text={'Delete'}
              />
            </Menu>
          }
        >
          <Button icon={<Icon icon="cog-16" iconSize={16} />} minimal={true} />
        </Popover>
        <NavbarDivider />
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
  withAlertActions,
  withSettingsActions,
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
  withBanking(
    ({
      uncategorizedTransationsIdsSelected,
      excludedTransactionsIdsSelected,
      openMatchingTransactionAside,
      categorizedTransactionsSelected,
    }) => ({
      uncategorizedTransationsIdsSelected,
      excludedTransactionsIdsSelected,
      openMatchingTransactionAside,
      categorizedTransactionsSelected,
    }),
  ),
  withBankingActions,
)(AccountTransactionsActionsBar);
