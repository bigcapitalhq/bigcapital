import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
  Tag,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, Icon } from '@/components';
import { FormatDateCell } from '@/components/Utils/FormatDate';
import { safeCallback } from '@/utils';

export interface ApiKey {
  id: number;
  name?: string;
  token?: string;
  createdAt?: string;
}

export interface ActionsMenuPayload {
  onRevoke?: (apiKey: ApiKey) => void;
}

interface ActionsMenuProps {
  row: { original: ApiKey };
  payload: ActionsMenuPayload;
}

/**
 * API Keys table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onRevoke },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('api_key.revoke')}
        onClick={safeCallback(onRevoke, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Token accessor.
 * Displays the token value in a Tag component.
 */
function TokenAccessor(apiKey: ApiKey) {
  return <Tag minimal={true}>{apiKey.token || ''}</Tag>;
}

/**
 * Permissions accessor.
 * Since permissions aren't currently stored, we show a default message.
 */
function PermissionsAccessor(_apiKey: ApiKey) {
  return (
    <Tag>
      <T id={'api_key.full_access'} />
    </Tag>
  );
}

/**
 * Last Used accessor.
 * Since lastUsed isn't currently tracked, we show "Never".
 */
function LastUsedAccessor(_apiKey: ApiKey) {
  return <span>{intl.get('api_key.never')}</span>;
}

interface ActionsCellProps {
  payload: ActionsMenuPayload;
  row: { original: ApiKey };
}

/**
 * Actions cell.
 */
function ActionsCell(props: ActionsCellProps) {
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
        Header: intl.get('api_key.name'),
        accessor: (row: ApiKey) => row.name || intl.get('api_key.unnamed'),
        width: 200,
        className: 'name',
      },
      {
        id: 'token',
        Header: intl.get('api_key.token'),
        accessor: TokenAccessor,
        width: 100,
        className: 'token',
      },
      {
        id: 'permissions',
        Header: intl.get('api_key.permissions'),
        accessor: PermissionsAccessor,
        width: 150,
        className: 'permissions',
      },
      {
        id: 'last_used',
        Header: intl.get('api_key.last_used'),
        accessor: LastUsedAccessor,
        width: 150,
        className: 'last_used',
      },
      {
        id: 'created_at',
        Header: intl.get('api_key.generated_at'),
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
