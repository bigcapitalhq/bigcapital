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
import { AbilitySubject, AccountAction } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type AccountTableRow = Account & {
  // `description` is returned by the server but not declared on the SDK type.
  description?: string;
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
  row: { original: AccountTableRow };
  payload: ActionsMenuPayload;
}

interface CellProps {
  cell: { row: { original: AccountTableRow } };
}

interface NormalCellProps {
  cell: { value?: string };
}

/**
 * Accounts table actions menu.
 */
export function ActionsMenu({
  row: { original },
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
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_account')}
          onClick={safeCallback(onEdit, original)}
        />

        <MenuItem
          icon={<Icon icon="plus" />}
          text={intl.get('new_child_account')}
          onClick={safeCallback(onNewChild, original)}
        />
        <MenuDivider />
      </Can>
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <If condition={!!original.active}>
          <MenuItem
            text={intl.get('inactivate_account')}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={safeCallback(onInactivate, original)}
          />
        </If>
        <If condition={!original.active}>
          <MenuItem
            text={intl.get('activate_account')}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={safeCallback(onActivate, original)}
          />
        </If>
      </Can>
      <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
        <MenuItem
          text={intl.get('delete_account')}
          icon={<Icon icon="trash-16" iconSize={16} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </Can>
    </Menu>
  );
}

/**
 * Normal cell.
 */
export function NormalCell({ cell: { value } }: NormalCellProps) {
  const arrowDirection = value === 'credit' ? 'down' : 'up';

  // Can't continue if the value is not `credit` or `debit`.
  if (['credit', 'debit'].indexOf(value ?? '') === -1) {
    return null;
  }
  return (
    <Tooltip
      className={Classes.TOOLTIP_INDICATOR}
      content={intl.get(value ?? '')}
      position={Position.RIGHT}
      hoverOpenDelay={100}
    >
      <Icon icon={`arrow-${arrowDirection}`} />
    </Tooltip>
  );
}

/**
 * Balance cell.
 */
export function BalanceCell({ cell }: CellProps) {
  const account = cell.row.original;

  return account.amount !== null ? (
    <span>{account.formattedAmount}</span>
  ) : (
    // `class` should be `className` — preserved from @ts-nocheck.
    // @ts-expect-error latent bug
    <span class="placeholder">—</span>
  );
}

/**
 * Balance cell.
 */
export function BankBalanceCell({ cell }: CellProps) {
  const account = cell.row.original;

  return account.amount !== null ? (
    <span>{account.bankBalanceFormatted}</span>
  ) : (
    // `class` should be `className` — preserved from @ts-nocheck.
    // @ts-expect-error latent bug
    <span class="placeholder">—</span>
  );
}
