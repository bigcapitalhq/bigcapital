// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { isNull, isEmpty } from 'lodash';
import { compose, curry } from 'lodash/fp';
import { Link } from 'react-router-dom';
import { ContextMenu2 } from '@blueprintjs/popover2';
import { Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';

import {
  AccountAction,
  CashflowAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import {
  getAddMoneyInOptions,
  getAddMoneyOutOptions,
} from '@/constants/cashflowOptions';

import { BankAccountsList, BankAccount, If, Icon, T, Can } from '@/components';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';

import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { AccountDialogAction } from '@/containers/Dialogs/AccountDialog/utils';
import { safeCallback } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

const CASHFLOW_SKELETON_N = 4;

/**
 * Cashflow accounts skeleton for loading state.
 */
function CashflowAccountsSkeleton() {
  return [...Array(CASHFLOW_SKELETON_N)].map((e, i) => (
    <BankAccount
      title={'XXXXX'}
      code={'XXXXX'}
      balance={'XXXXXX'}
      cash={'cash'}
      loading={true}
    />
  ));
}

/**
 * Cashflow bank account.
 */
function CashflowBankAccount({
  // #withAlertsDialog
  openAlert,

  // #withDial
  openDialog,

  // #withDrawerActions
  openDrawer,

  account,
}) {
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
      id: account.id,
    });
  };
  // Handle money in menu item actions.
  const handleMoneyInClick = (transactionType) => {
    openDialog('money-in', {
      account_type: transactionType,
      account_id: account.id,
    });
  };
  // Handle money out menu item actions.
  const handleMoneyOutClick = (transactionType) => {
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
          balance={!isNull(account.amount) ? account.formatted_amount : '-'}
          type={account.account_type}
          updatedBeforeText={getUpdatedBeforeText(account.createdAt)}
        />
      </CashflowAccountAnchor>
    </ContextMenu2>
  );
}

const CashflowBankAccountEnhanced = compose(
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
)(CashflowBankAccount);

function getUpdatedBeforeText(createdAt) {
  return '';
}

/**
 * Cashflow accounts grid items.
 */
function CashflowAccountsGridItems({ accounts }) {
  return accounts.map((account) => (
    <CashflowBankAccountEnhanced account={account} />
  ));
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
export default function CashflowAccountsGrid() {
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
          <CashflowAccountsGridItems accounts={cashflowAccounts} />
        )}
      </BankAccountsList>
    </CashflowAccountsGridWrap>
  );
}

/**
 * Cashflow account money out context menu.
 */
function CashflowAccountMoneyInContextMenu({ onClick }) {
  const handleItemClick = curry((transactionType, event) => {
    onClick && onClick(transactionType, event);
  });
  // Retrieves the add money in button options.
  const addMoneyInOptions = useMemo(() => getAddMoneyInOptions(), []);

  return addMoneyInOptions.map((option) => (
    <MenuItem text={option.name} onClick={handleItemClick(option.value)} />
  ));
}

/**
 * Cashflow account money in context menu.
 */
function CashflowAccountMoneyOutContextMenu({ onClick }) {
  const handleItemClick = curry((transactionType, event) => {
    onClick && onClick(transactionType, event);
  });
  // Retrieves the add money out button options.
  const addMoneyOutOptions = useMemo(() => getAddMoneyOutOptions(), []);

  return addMoneyOutOptions.map((option) => (
    <MenuItem text={option.name} onClick={handleItemClick(option.value)} />
  ));
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
}) {
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
      <Can I={CashflowAction.Edit} a={AbilitySubject.Cashflow}>
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

const CashflowBankAccountWrap = styled.div``;

const AccountsEmptyStateBase = styled.div`
  flex: 1;
  text-align: center;
  margin: 2rem 0;
`;
const AccountsEmptyStateTitle = styled.h1`
  font-size: 16px;
  color: #626b76;
  opacity: 0.8;
  line-height: 1.6;
  font-weight: 500;
`;
