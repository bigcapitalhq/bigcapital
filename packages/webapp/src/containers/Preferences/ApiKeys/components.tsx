// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, Icon } from '@/components';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
  Tag,
} from '@blueprintjs/core';
import { safeCallback } from '@/utils';
import { FormatDateCell } from '@/components/Utils/FormatDate';

/**
 * API Keys table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onRevoke },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('revoke')}
        onClick={safeCallback(onRevoke, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Permissions accessor.
 * Since permissions aren't currently stored, we show a default message.
 */
function PermissionsAccessor(apiKey) {
  return (
    <Tag minimal={true}>
      <T id={'full_access'} />
    </Tag>
  );
}

/**
 * Last Used accessor.
 * Since lastUsed isn't currently tracked, we show "Never".
 */
function LastUsedAccessor(apiKey) {
  return <span>Never</span>;
}

/**
 * Actions cell.
 */
function ActionsCell(props) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

/**
 * Retrieve API Keys table columns.
 */
export function useApiKeysTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: intl.get('name'),
        accessor: (row) => row.name || 'Unnamed',
        width: 200,
        className: 'name',
      },
      {
        id: 'permissions',
        Header: intl.get('permissions'),
        accessor: PermissionsAccessor,
        width: 150,
        className: 'permissions',
      },
      {
        id: 'last_used',
        Header: intl.get('last_used'),
        accessor: LastUsedAccessor,
        width: 150,
        className: 'last_used',
      },
      {
        id: 'created_at',
        Header: intl.get('generated_at'),
        accessor: 'createdAt',
        Cell: FormatDateCell,
        width: 150,
        className: 'created_at',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [],
  );
}
