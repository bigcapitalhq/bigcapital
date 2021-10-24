import React from 'react';
import { isNull } from 'lodash';
import { compose } from 'lodash/fp';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import useContextMenu from 'react-use-context-menu';

import {
  ContextMenu,
  BankAccountsList,
  BankAccount,
  If,
  Icon,
} from '../../../components';
import AccountsAlerts from './../../Accounts/AccountsAlerts';

import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';

import withDrawerActions from '../../Drawer/withDrawerActions';
import withAlertsActions from '../../Alert/withAlertActions';
import withDialogActions from '../../Dialog/withDialogActions';

import { safeCallback } from 'utils';

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
  const [
    bindMenu,
    bindMenuItem,
    useContextTrigger,
    { coords, setVisible, isVisible },
  ] = useContextMenu();

  const [bindTrigger] = useContextTrigger({
    collect: () => 'Title',
  });

  const handleClose = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  // Handle view detail account.
  const handleViewClick = () => {
    openDrawer('account-drawer', { accountId: account.id });
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
    openDialog('account-form', { action: 'edit', id: account.id });
  };

  return (
    <CashflowBankAccountWrap>
      <CashflowAccountAnchor
        to={`/cashflow-accounts/${account.id}/transactions`}
      >
        <BankAccount
          {...bindTrigger}
          title={account.name}
          code={account.code}
          balance={!isNull(account.amount) ? account.formatted_amount : '-'}
          type={'cash'}
          updatedBeforeText={getUpdatedBeforeText(account.createdAt)}
        />
      </CashflowAccountAnchor>

      <ContextMenu
        bindMenu={bindMenu}
        isOpen={isVisible}
        coords={coords}
        onClosed={handleClose}
      >
        <CashflowAccountContextMenu
          onViewClick={handleViewClick}
          onDeleteClick={handleDeleteClick}
          onActivateClick={handleActivateClick}
          onInactivateClick={handleInactivateClick}
          onEditClick={handleEditAccount}
        />
      </ContextMenu>
    </CashflowBankAccountWrap>
  );
}

const CashflowBankAccountEnhanced = compose(
  withAlertsActions,
  withDrawerActions,
  withDialogActions,
)(CashflowBankAccount);

function getUpdatedBeforeText(createdAt) {
  return 'Updated before 2 years.';
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
        ) : (
          <CashflowAccountsGridItems accounts={cashflowAccounts} />
        )}
      </BankAccountsList>

      <AccountsAlerts />
    </CashflowAccountsGridWrap>
  );
}

/**
 * Cashflow account context menu.
 */
function CashflowAccountContextMenu({
  onViewClick,
  onEditClick,
  onInactivateClick,
  onActivateClick,
  onDeleteClick,
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewClick)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_account')}
        onClick={safeCallback(onEditClick)}
      />
      <MenuDivider />
      <If condition={false}>
        <MenuItem
          text={intl.get('inactivate_account')}
          icon={<Icon icon="pause-16" iconSize={16} />}
          onClick={safeCallback(onInactivateClick)}
        />
      </If>
      <If condition={!false}>
        <MenuItem
          text={intl.get('activate_account')}
          icon={<Icon icon="play-16" iconSize={16} />}
          onClick={safeCallback(onActivateClick)}
        />
      </If>
      <MenuItem
        text={intl.get('delete_account')}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteClick)}
      />
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
