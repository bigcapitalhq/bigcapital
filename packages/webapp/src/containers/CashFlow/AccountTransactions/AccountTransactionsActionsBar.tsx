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
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withBanking } from '../withBanking';
import { withBankingActions } from '../withBankingActions';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { CashFlowMenuItems } from './utils';
import type { CashFlowMenuItem } from './utils';
import type { WithBankingProps } from '../withBanking';
import type { WithBankingActionsProps } from '../withBankingActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  Icon,
  DashboardActionsBar,
  DashboardRowsHeightButton,
  FormattedMessage as T,
  AppToaster,
  If,
} from '@/components';
import { useAppShellContext } from '@/components/AppShell/AppContentShell/AppContentShellProvider';
import {
  getAddMoneyOutOptions,
  getAddMoneyInOptions,
} from '@/constants/cashflowOptions';
import { DialogsName } from '@/constants/dialogs';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useRefreshCashflowTransactions, useSaveSettings } from '@/hooks/query';
import {
  useUpdateBankAccount,
  useExcludeUncategorizedTransactions,
  useUnexcludeUncategorizedTransactions,
} from '@/hooks/query/banking';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { compose } from '@/utils';

interface AccountTransactionsActionsBarInnerProps
  extends Pick<WithDialogActionsProps, 'openDialog'>,
    Pick<
      WithBankingProps,
      | 'uncategorizedTransationsIdsSelected'
      | 'excludedTransactionsIdsSelected'
      | 'openMatchingTransactionAside'
      | 'categorizedTransactionsSelected'
    >,
    Pick<WithBankingActionsProps, 'enableMultipleCategorization'>,
    Pick<WithAlertActionsProps, 'openAlert'> {}

function AccountTransactionsActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withBanking
  uncategorizedTransationsIdsSelected,
  excludedTransactionsIdsSelected,
  openMatchingTransactionAside,
  categorizedTransactionsSelected,

  // #withBankingActions
  enableMultipleCategorization,

  // #withAlerts
  openAlert,
}: AccountTransactionsActionsBarInnerProps) {
  // Settings hook.
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();
  const { accountId, currentAccount, cashflowTransactionsSettings } =
    useAccountTransactionsContext();
  const cashflowTansactionsTableSize =
    cashflowTransactionsSettings?.tableSize as string | undefined;

  // Refresh cashflow infinity transactions hook.
  const { refresh } = useRefreshCashflowTransactions();

  const { mutateAsync: updateBankAccount } = useUpdateBankAccount();

  // Retrieves the money in/out buttons options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);
  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  const isFeedsActive = !!currentAccount?.isFeedsActive;
  const isFeedsPaused = !!currentAccount?.isFeedsPaused;
  const isSyncingOwner = !!currentAccount?.isSyncingOwner;

  // Handle table row size change.
  const handleTableRowSizeChange = (size: unknown) => {
    saveSettings({
      options: [
        { group: 'cashflowTransactions', key: 'tableSize', value: size },
      ],
    });
  };
  // Handle money in form
  const handleMoneyInFormTransaction = (account: CashFlowMenuItem) => {
    openDialog('money-in', {
      account_id: accountId,
      account_type: account.value,
      account_name: account.name,
    });
  };
  // Handle money out form
  const handlMoneyOutFormTransaction = (account: CashFlowMenuItem) => {
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
    refresh();
  };

  const {
    mutateAsync: excludeUncategorizedTransactions,
    isPending: isExcludingLoading,
  } = useExcludeUncategorizedTransactions();

  const {
    mutateAsync: unexcludeUncategorizedTransactions,
    isPending: isUnexcludingLoading,
  } = useUnexcludeUncategorizedTransactions();

  // Handles the exclude uncategorized transactions in bulk.
  const handleExcludeUncategorizedBtnClick = () => {
    excludeUncategorizedTransactions({
      ids: uncategorizedTransationsIdsSelected as number[],
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
      ids: excludedTransactionsIdsSelected as number[],
    })
      .then(() => {
        AppToaster.show({
          message: 'The selected excluded transactions have been unexcluded.',
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

  // Handle multi select transactions for categorization or matching.
  const handleMultipleCategorizingSwitch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const { hideAside } = useAppShellContext();
  const isMin1350Query = useMediaQuery('(min-width: 1350px)');

  // Shrink actions to dropdown if the aside is open and matched the media query,
  // To avoid actions overflow in small screens.
  const shrinkActions = !hideAside && !isMin1350Query;

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <CashFlowMenuItems
          items={addMoneyInOptions}
          onItemSelect={handleMoneyInFormTransaction}
          text={<T id={'banking.label.add_money_in'} />}
          buttonProps={{
            icon: <Icon icon={'arrow-downward'} iconSize={20} />,
          }}
        />
        <CashFlowMenuItems
          items={addMoneyOutOptions}
          onItemSelect={handlMoneyOutFormTransaction}
          text={<T id={'banking.label.add_money_out'} />}
          buttonProps={{
            icon: <Icon icon={'arrow-upward'} iconSize={20} />,
          }}
        />
        <NavbarDivider />

        <If condition={!shrinkActions}>
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
        </If>

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

        <If condition={shrinkActions}>
          <NavbarDivider />
          <Popover
            minimal={true}
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
            modifiers={{
              offset: { offset: '0, 4' },
            }}
            content={
              <Menu>
                <MenuItem
                  icon={<Icon icon="print-16" iconSize={16} />}
                  text={<T id={'print'} />}
                />
                <MenuItem
                  icon={<Icon icon="file-export-16" iconSize={16} />}
                  text={<T id={'export'} />}
                />
                <MenuItem
                  icon={<Icon icon="file-import-16" iconSize={16} />}
                  text={<T id={'import'} />}
                  onClick={handleImportBtnClick}
                />
              </Menu>
            }
          >
            <Button
              icon={<Icon icon="more-h-16" iconSize={16} />}
              minimal={true}
            />
          </Popover>
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

export const AccountTransactionsActionsBar = compose(
  withDialogActions,
  withAlertActions,
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
)(AccountTransactionsActionsBarInner);
