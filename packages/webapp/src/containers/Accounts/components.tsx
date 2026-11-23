import {
  Position,
  Classes,
  Tooltip,
  MenuItem,
  Menu,
  MenuDivider,
  Intent,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { Account } from '@bigcapital/sdk-ts';
import { Can, Icon, If } from '@/components';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
import { AbilitySubject, AccountAction } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type AccountTableRow = Omit<Account, 'amount'> & {
  // The list endpoint returns a tree, while the SDK describes a single account.
  children?: AccountTableRow[];
  amount: number | null;
};

interface ActionsMenuPayload {
  onEdit: (account: AccountTableRow) => void;
  onViewDetails: (account: AccountTableRow) => void;
  onDelete: (account: AccountTableRow) => void;
  onNewChild: (account: AccountTableRow) => void;
  onActivate: (account: AccountTableRow) => void;
  onInactivate: (account: AccountTableRow) => void;
}

interface ActionsMenuProps {
  account: AccountTableRow;
  payload: ActionsMenuPayload;
}

/**
 * Accounts table actions menu.
 */
export function ActionsMenu({
  account,
  payload: {
    onEdit,
    onViewDetails,
    onDelete,
    onNewChild,
    onActivate,
    onInactivate,
  },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, account)}
      />
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_account')}
          onClick={safeCallback(onEdit, account)}
        />

        <MenuItem
          icon={<Icon icon="plus" />}
          text={intl.get('new_child_account')}
          onClick={safeCallback(onNewChild, account)}
        />
        <MenuDivider />
      </Can>
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <If condition={!!account.active}>
          <MenuItem
            text={intl.get('inactivate_account')}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={safeCallback(onInactivate, account)}
          />
        </If>
        <If condition={!account.active}>
          <MenuItem
            text={intl.get('activate_account')}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={safeCallback(onActivate, account)}
          />
        </If>
      </Can>
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <MenuItem
          text={intl.get('delete_account')}
          icon={<Icon icon="trash-16" iconSize={16} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, account)}
        />
      </Can>
    </Menu>
  );
}

/**
 * Normal cell.
 */
export function NormalCell({ value }: { value: string }) {
  if (value !== 'credit' && value !== 'debit') {
    return null;
  }
  return (
    <Tooltip
      className={Classes.TOOLTIP_INDICATOR}
      content={intl.get(value)}
      position={Position.RIGHT}
      hoverOpenDelay={100}
    >
      <Icon icon={value === 'credit' ? 'arrow-down' : 'arrow-up'} />
    </Tooltip>
  );
}

/**
 * Balance cell.
 */
export function BalanceCell({ value }: { value: string | null }) {
  return <MoneyDisplay>{value ?? '—'}</MoneyDisplay>;
}
