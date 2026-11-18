import { Intent, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import type { CashflowAccountRow } from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { Can, Icon, T } from '@/components';
import {
  AccountAction,
  AbilitySubject,
  CashflowAction,
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

interface MoneyContextMenuProps {
  onClick: (transactionType: string) => void;
}

interface CashflowAccountMenuInnerProps
  extends Pick<WithAlertActionsProps, 'openAlert'>,
    Pick<WithDialogActionsProps, 'openDialog'>,
    Pick<WithDrawerActionsProps, 'openDrawer'> {
  account: CashflowAccountRow;
}

interface CashflowAccountMenuProps {
  account: CashflowAccountRow;
}

/**
 * Cashflow account money in context menu.
 */
function CashflowAccountMoneyInContextMenu({ onClick }: MoneyContextMenuProps) {
  // Retrieves the add money in button options.
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
 * Cashflow account money out context menu.
 */
function CashflowAccountMoneyOutContextMenu({
  onClick,
}: MoneyContextMenuProps) {
  // Retrieves the add money out button options.
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
function CashflowAccountMenuInner({
  account,
  openAlert,
  openDialog,
  openDrawer,
}: CashflowAccountMenuInnerProps) {
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
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(handleViewClick)}
      />
      <Can I={CashflowAction.Create} a={AbilitySubject.Cashflow}>
        <MenuDivider />
        <MenuItem
          text={<T id={'cash_flow_money_in'} />}
          icon={<Icon icon={'arrow-downward'} iconSize={16} />}
        >
          <CashflowAccountMoneyInContextMenu onClick={handleMoneyInClick} />
        </MenuItem>

        <MenuItem
          text={<T id={'cash_flow_money_out'} />}
          icon={<Icon icon={'arrow-upward'} iconSize={16} />}
        >
          <CashflowAccountMoneyOutContextMenu onClick={handleMoneyOutClick} />
        </MenuItem>
      </Can>
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_account')}
          onClick={safeCallback(handleEditAccount)}
        />
      </Can>
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <MenuDivider />
        {account.active ? (
          <MenuItem
            text={intl.get('inactivate_account')}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={safeCallback(handleInactivateClick)}
          />
        ) : (
          <MenuItem
            text={intl.get('activate_account')}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={safeCallback(handleActivateClick)}
          />
        )}
      </Can>
      <Can I={CashflowAction.Delete} a={AbilitySubject.Cashflow}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_account')}
          icon={<Icon icon="trash-16" iconSize={16} />}
          intent={Intent.DANGER}
          onClick={safeCallback(handleDeleteClick)}
        />
      </Can>
    </Menu>
  );
}

const CashflowAccountMenuEnhanced = FF.pipe(
  CashflowAccountMenuInner,
  withDialogActions,
  withDrawerActions,
  withAlertActions,
);

/**
 * Cashflow account actions menu.
 * Shared between the legacy grid context menu and the list view row menu.
 */
export function CashflowAccountMenu({ account }: CashflowAccountMenuProps) {
  return <CashflowAccountMenuEnhanced account={account} />;
}
