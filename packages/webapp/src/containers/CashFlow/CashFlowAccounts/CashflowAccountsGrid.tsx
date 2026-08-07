import { Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import { ContextMenu2 } from '@blueprintjs/popover2';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';
import type { CashflowAccountRow } from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { BankAccountsList, BankAccount, If, Icon, T, Can } from '@/components';
import {
  AccountAction,
  CashflowAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import {
  getAddMoneyInOptions,
  getAddMoneyOutOptions,
} from '@/constants/cashflowOptions';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { AccountDialogAction } from '@/containers/Dialogs/AccountDialog/utils';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { safeCallback } from '@/utils';
import { compose } from '@/utils';

const CASHFLOW_SKELETON_N = 4;

interface MoneyContextMenuProps {
  onClick: (transactionType: string) => void;
}

interface CashflowAccountContextMenuProps {
  account: CashflowAccountRow;
  onViewClick: () => void;
  onEditClick: () => void;
  onInactivateClick: () => void;
  onActivateClick: () => void;
  onDeleteClick: () => void;
  onMoneyInClick: (transactionType: string) => void;
  onMoneyOutClick: (transactionType: string) => void;
}

interface CashflowBankAccountProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDialogActionsProps, 'openDialog'>,
    Pick<WithDrawerActionsProps, 'openDrawer'> {
  account: CashflowAccountRow;
}

interface CashflowAccountsGridItemsProps {
  accounts: CashflowAccountRow[];
}

/**
 * Cashflow accounts skeleton for loading state.
 */
function CashflowAccountsSkeleton() {
  return (
    <>
      {Array.from({ length: CASHFLOW_SKELETON_N }).map((_, i) => (
        <BankAccount
          key={i}
          title={'XXXXX'}
          code={'XXXXX'}
          balance={'XXXXXX'}
          type={'cash'}
          updatedBeforeText={''}
          uncategorizedTransactionsCount={0}
          loading={true}
        />
      ))}
    </>
  );
}

/**
 * Cashflow bank account.
 */
function CashflowBankAccount({
  openAlert,
  openDialog,
  openDrawer,
  account,
}: CashflowBankAccountProps) {
  // Handle view detail account.
  const handleViewClick = () => {
    openDrawer(DRAWERS.ACCOUNT_DETAILS, { accountId: account.id });
  };
  // Handle delete action account.
  const handleDeleteClick = () => {
    openAlert('account-delete', { accountId: account.id });
  };
  // Handle inactivate action account.
  const handleInactivateClick = () => {
    openAlert('account-inactivate', { accountId: account.id });
  };
  // Handle activate action account.
  const handleActivateClick = () => {
    openAlert('account-activate', { accountId: account.id });
  };
  // Handle edit account action.
  const handleEditAccount = () => {
    openDialog(DialogsName.AccountForm, {
      action: AccountDialogAction.Edit,
      accountId: account.id,
    });
  };
  // Handle money in menu item actions.
  const handleMoneyInClick = (transactionType: string) => {
    openDialog('money-in', {
      account_type: transactionType,
      account_id: account.id,
    });
  };
  // Handle money out menu item actions.
  const handleMoneyOutClick = (transactionType: string) => {
    openDialog('money-out', {
      account_type: transactionType,
      account_id: account.id,
    });
  };

  return (
    <ContextMenu2
      content={
        <CashflowAccountContextMenu
          account={account}
          onViewClick={handleViewClick}
          onDeleteClick={handleDeleteClick}
          onActivateClick={handleActivateClick}
          onInactivateClick={handleInactivateClick}
          onEditClick={handleEditAccount}
          onMoneyInClick={handleMoneyInClick}
          onMoneyOutClick={handleMoneyOutClick}
        />
      }
    >
      <CashflowAccountAnchor
        to={`/cashflow-accounts/${account.id}/transactions`}
      >
        <BankAccount
          title={account.name}
          code={account.code}
          balance={account.amount != null ? account.formattedAmount : '-'}
          type={account.accountType}
          updatedBeforeText={
            account.lastFeedsUpdatedFromNow
              ? `Updated ${account.lastFeedsUpdatedFromNow} ago`
              : ''
          }
          uncategorizedTransactionsCount={undefined}
        />
      </CashflowAccountAnchor>
    </ContextMenu2>
  );
}

const CashflowBankAccountEnhanced = compose(
  withAlertActions,
  withDrawerActions,
  withDialogActions,
)(CashflowBankAccount);

/**
 * Cashflow accounts grid items.
 */
function CashflowAccountsGridItems({
  accounts,
}: CashflowAccountsGridItemsProps) {
  return (
    <>
      {accounts.map((account) => (
        <CashflowBankAccountEnhanced key={account.id} account={account} />
      ))}
    </>
  );
}

/**
 * Cashflow accounts empty state.
 */
function CashflowAccountsEmptyState() {
  return (
    <AccountsEmptyStateBase>
      <AccountsEmptyStateTitle>
        <T id={'cash_flow.accounts.no_results'} />
      </AccountsEmptyStateTitle>
    </AccountsEmptyStateBase>
  );
}

/**
 * Cashflow accounts grid.
 */
export function CashflowAccountsGrid() {
  // Retrieve list context.
  const { cashflowAccounts, isCashFlowAccountsLoading } =
    useCashFlowAccountsContext();

  return (
    <CashflowAccountsGridWrap>
      <BankAccountsList>
        {isCashFlowAccountsLoading ? (
          <CashflowAccountsSkeleton />
        ) : isEmpty(cashflowAccounts) ? (
          <CashflowAccountsEmptyState />
        ) : (
          <CashflowAccountsGridItems accounts={cashflowAccounts ?? []} />
        )}
      </BankAccountsList>
    </CashflowAccountsGridWrap>
  );
}

/**
 * Cashflow account money out context menu.
 */
function CashflowAccountMoneyInContextMenu({ onClick }: MoneyContextMenuProps) {
  // Retreives the add money in button options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);

  return (
    <>
      {addMoneyInOptions.map((option) => (
        <MenuItem
          key={option.value}
          text={option.name}
          onClick={() => onClick?.(option.value)}
        />
      ))}
    </>
  );
}

/**
 * Cashflow account money in context menu.
 */
function CashflowAccountMoneyOutContextMenu({
  onClick,
}: MoneyContextMenuProps) {
  // Retreives the add money out button options.
  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  return (
    <>
      {addMoneyOutOptions.map((option) => (
        <MenuItem
          key={option.value}
          text={option.name}
          onClick={() => onClick?.(option.value)}
        />
      ))}
    </>
  );
}

/**
 * Cashflow account context menu.
 */
function CashflowAccountContextMenu({
  account,
  onViewClick,
  onEditClick,
  onInactivateClick,
  onActivateClick,
  onDeleteClick,
  onMoneyInClick,
  onMoneyOutClick,
}: CashflowAccountContextMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewClick)}
      />
      <Can I={CashflowAction.Create} a={AbilitySubject.Cashflow}>
        <MenuDivider />
        <MenuItem
          text={<T id={'cash_flow_money_in'} />}
          icon={<Icon icon={'arrow-downward'} iconSize={16} />}
        >
          <CashflowAccountMoneyInContextMenu onClick={onMoneyInClick} />
        </MenuItem>

        <MenuItem
          text={<T id={'cash_flow_money_out'} />}
          icon={<Icon icon={'arrow-upward'} iconSize={16} />}
        >
          <CashflowAccountMoneyOutContextMenu onClick={onMoneyOutClick} />
        </MenuItem>
      </Can>
      <Can
        // @ts-expect-error latent bug — CashflowAction.Edit is not defined in
        // the constants file; runtime receives `undefined`.
        I={CashflowAction.Edit}
        a={AbilitySubject.Cashflow}
      >
        <MenuDivider />

        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_account')}
          onClick={safeCallback(onEditClick)}
        />
      </Can>
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <MenuDivider />
        <If condition={account.active}>
          <MenuItem
            text={intl.get('inactivate_account')}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={safeCallback(onInactivateClick)}
          />
        </If>
        <If condition={!account.active}>
          <MenuItem
            text={intl.get('activate_account')}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={safeCallback(onActivateClick)}
          />
        </If>
      </Can>
      <Can I={CashflowAction.Delete} a={AbilitySubject.Cashflow}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_account')}
          icon={<Icon icon="trash-16" iconSize={16} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeleteClick)}
        />
      </Can>
    </Menu>
  );
}

const CashflowAccountAnchor = styled(Link)`
  &,
  &:hover,
  &:focus,
  &:active {
    color: inherit;
    text-decoration: none;
  }
`;

const CashflowAccountsGridWrap = styled.div`
  margin: 30px;
`;

const AccountsEmptyStateBase = styled.div`
  flex: 1;
  text-align: center;
  margin: 2rem 0;
`;
const AccountsEmptyStateTitle = styled.h1`
  --x-text-color: #626b76;

  .bp4-dark & {
    --x-text-color: rgba(255, 255, 255, 0.6);
  }
  font-size: 18px;
  color: var(--x-text-color);
  opacity: 0.8;
  line-height: 1.6;
  font-weight: 500;
`;
