import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuDivider,
  Tag,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { User } from '@bigcapital/sdk-ts';
import { FormattedMessage as T, Icon, If } from '@/components';
import { safeCallback, firstLettersArgs } from '@/utils';

// The SDK User type is narrower than what the runtime exposes; preserve the
// legacy property accesses (inviteAcceptedAt, fullName) by widening.
type UserRow = User & {
  inviteAcceptedAt?: string;
  fullName?: string;
};

interface RowShape {
  row: { original: UserRow };
}

/**
 * Avatar cell.
 */
function AvatarCell({ email }: { email: string } & Record<string, unknown>) {
  return <span className={'avatar'}>{firstLettersArgs(email)}</span>;
}

export interface ActionsMenuPayload {
  onEdit?: (user: UserRow) => void;
  onInactivate?: (user: UserRow) => void;
  onActivate?: (user: UserRow) => void;
  onDelete?: (user: UserRow) => void;
  onResendInvitation?: (user: UserRow) => void;
}

interface ActionsMenuProps extends RowShape {
  payload: ActionsMenuPayload;
}

/**
 * Users table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onInactivate, onActivate, onDelete, onResendInvitation },
}: ActionsMenuProps) {
  return (
    <Menu>
      <If condition={!!original.inviteAcceptedAt}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_user')}
          onClick={safeCallback(onEdit, original)}
        />
        <MenuDivider />

        {original.active ? (
          <MenuItem
            text={intl.get('inactivate_user')}
            onClick={safeCallback(onInactivate, original)}
            icon={<Icon icon="pause-16" iconSize={16} />}
          />
        ) : (
          <MenuItem
            text={intl.get('activate_user')}
            onClick={safeCallback(onActivate, original)}
            icon={<Icon icon="play-16" iconSize={16} />}
          />
        )}
      </If>

      <If condition={!original.inviteAcceptedAt}>
        <MenuItem
          text={'Resend invitation'}
          onClick={safeCallback(onResendInvitation, original)}
          icon={<Icon icon="send" iconSize={16} />}
        />
      </If>

      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_user')}
        onClick={safeCallback(onDelete, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Status accessor.
 */
function StatusAccessor(user: UserRow) {
  return !user.inviteAcceptedAt ? (
    <Tag minimal={true}>
      <T id={'inviting'} />
    </Tag>
  ) : user.active ? (
    <Tag intent={Intent.SUCCESS} minimal={true}>
      <T id={'activate'} />
    </Tag>
  ) : (
    <Tag intent={Intent.WARNING} minimal={true}>
      <T id={'inactivate'} />
    </Tag>
  );
}

interface ActionsCellProps {
  payload: ActionsMenuPayload;
  row: { original: UserRow };
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

function FullNameAccessor(user: UserRow) {
  return user.inviteAcceptedAt ? user.fullName : user.email;
}

export const useUsersListColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarCell,
        width: 40,
      },
      {
        id: 'full_name',
        Header: intl.get('full_name'),
        accessor: FullNameAccessor,
        width: 150,
      },
      {
        id: 'email',
        Header: intl.get('email'),
        accessor: 'email',
        width: 150,
      },
      {
        id: 'role_name',
        Header: intl.get('users.column.role_name'),
        accessor: 'role_name',
        width: 120,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: StatusAccessor,
        width: 80,
        className: 'status',
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
};
