import React from 'react';
import {
  Position,
  Classes,
  Tooltip,
  MenuItem,
  Menu,
  MenuDivider,
  Intent
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Icon, Money, If } from 'components';
import { saveInvoke } from 'utils';
import { formatMessage } from 'services/intl';

export function AccountActionsMenu({ row: { original } }) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={formatMessage({ id: 'view_details' })}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_account' })}
        // onClick={handleEditAccount}
      />
      <MenuItem
        icon={<Icon icon="plus" />}
        text={formatMessage({ id: 'new_child_account' })}
        // onClick={handleNewChildAccount}
      />
      <MenuDivider />
      <If condition={original.active}>
        <MenuItem
          text={formatMessage({ id: 'inactivate_account' })}
          icon={<Icon icon="pause-16" iconSize={16} />}
          // onClick={handleInactivateAccount}
        />
      </If>
      <If condition={!original.active}>
        <MenuItem
          text={formatMessage({ id: 'activate_account' })}
          icon={<Icon icon="play-16" iconSize={16} />}
          // onClick={handleActivateAccount}
        />
      </If>
      <MenuItem
        text={formatMessage({ id: 'delete_account' })}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
        // onClick={handleDeleteA ccount}
      />
    </Menu>
  );
}


export function NormalCell({ cell: { value } }) {
  const { formatMessage } = useIntl();
  const arrowDirection = value === 'credit' ? 'down' : 'up';

  // if (value !== 'credit' || value !== 'debit') {
  //   return '';
  // }
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

export function BalanceCell({ cell }) {
  const account = cell.row.original;

  return account.amount ? (
    <span>
      <Money amount={account.amount} currency={'USD'} />
    </span>
  ) : (
    <span class="placeholder">—</span>
  );
}

export function InactiveSemafro() {
  return (
    <Tooltip
      content={<T id="inactive" />}
      className={classNames(
        Classes.TOOLTIP_INDICATOR,
        'bp3-popover-wrapper--inactive-semafro',
      )}
      position={Position.TOP}
      hoverOpenDelay={250}
    >
      <div className="inactive-semafro"></div>
    </Tooltip>
  );
}
