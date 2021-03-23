import React, { memo } from 'react';
import {
  Position,
  Classes,
  Tooltip,
  MenuItem,
  Menu,
  MenuDivider,
  Intent,
  Popover,
  Button,
} from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { Icon, Money, If } from 'components';
import { formatMessage } from 'services/intl';
import { safeCallback } from 'utils';

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
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={formatMessage({ id: 'view_details' })}
        onClick={safeCallback(onViewDetails, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_account' })}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon="plus" />}
        text={formatMessage({ id: 'new_child_account' })}
        onClick={safeCallback(onNewChild, original)}
      />
      <MenuDivider />
      <If condition={original.active}>
        <MenuItem
          text={formatMessage({ id: 'inactivate_account' })}
          icon={<Icon icon="pause-16" iconSize={16} />}
          onClick={safeCallback(onInactivate, original)}
        />
      </If>
      <If condition={!original.active}>
        <MenuItem
          text={formatMessage({ id: 'activate_account' })}
          icon={<Icon icon="play-16" iconSize={16} />}
          onClick={safeCallback(onActivate, original)}
        />
      </If>
      <MenuItem
        text={formatMessage({ id: 'delete_account' })}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
    </Menu>
  );
}

/**
 * Actions cell.
 */
export function ActionsCell(props) {
  return (
    <Popover
      position={Position.RIGHT_BOTTOM}
      content={<ActionsMenu {...props} />}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

/**
 * Normal cell.
 */
export function NormalCell({ cell: { value } }) {
  const { formatMessage } = useIntl();
  const arrowDirection = value === 'credit' ? 'down' : 'up';

  // Can't continue if the value is not `credit` or `debit`.
  if (['credit', 'debit'].indexOf(value) === -1) {
    return '';
  }
  return (
    <Tooltip
      className={Classes.TOOLTIP_INDICATOR}
      content={formatMessage({ id: value })}
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
export function BalanceCell({ cell }) {
  const account = cell.row.original;

  return account.amount !== null ? (
    <span>
      <Money amount={account.amount} currency={'USD'} />
    </span>
  ) : (
    <span class="placeholder">—</span>
  );
}
