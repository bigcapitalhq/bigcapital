// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent, Button, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

import { SwitchFieldCell } from '@/components/DataTableCells';
import { safeInvoke } from '@/utils';

/**
 * Notification accessor.
 */
export const NotificationAccessor = (row) => {
  return (
    <span className="notification">
      <NotificationLabel>{row.notification_label}</NotificationLabel>
      <NotificationDescription>
        {row.notification_description}
      </NotificationDescription>
    </span>
  );
};

/**
 * SMS notification message cell.
 */
export const SMSMessageCell = ({
  payload: { onEditMessageText },
  row: { original },
}) => (
  <div>
    <MessageBox>{original.sms_message}</MessageBox>
    <MessageBoxActions>
      <Button
        minimal={true}
        small={true}
        intent={Intent.NONE}
        onClick={() => safeInvoke(onEditMessageText, original)}
      >
        {intl.get('sms_messages.label_edit_message')}
      </Button>
    </MessageBoxActions>
  </div>
);

/**
 * Context menu of SMS notification messages.
 */
export function ActionsMenu({
  payload: { onEditMessageText, onEnableNotification, onDisableNotification },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        text={intl.get('sms_notifications.edit_message_text')}
        onClick={() => safeInvoke(onEditMessageText, original)}
      />
      <MenuDivider />
      {!original.is_notification_enabled ? (
        <MenuItem
          text={intl.get('sms_notifications.enable_notification')}
          onClick={() => safeInvoke(onEnableNotification, original)}
        />
      ) : (
        <MenuItem
          text={intl.get('sms_notifications.disable_notification')}
          onClick={() => safeInvoke(onDisableNotification, original)}
        />
      )}
    </Menu>
  );
}

/**
 * Retrieve SMS notifications messages table columns
 * @returns
 */
export function useSMSIntegrationTableColumns({ onSwitchChange }) {
  return React.useMemo(
    () => [
      {
        id: 'notification',
        Header: intl.get('sms_messages.column.notification'),
        accessor: NotificationAccessor,
        className: 'notification',
        width: '180',
        disableSortBy: true,
      },
      {
        Header: intl.get('sms_messages.column.service'),
        accessor: 'module_formatted',
        className: 'service',
        width: '80',
        disableSortBy: true,
      },
      {
        Header: intl.get('sms_messages.column.message'),
        accessor: 'sms_message',
        Cell: SMSMessageCell,
        className: 'sms_message',
        width: '180',
        disableSortBy: true,
      },
      {
        Header: intl.get('sms_messages.column.auto'),
        accessor: 'is_notification_enabled',
        Cell: SwitchFieldCell,
        className: 'is_notification_enabled',
        disableResizing: true,
        disableSortBy: true,
        width: '80',
        onSwitchChange,
      },
    ],
    [onSwitchChange],
  );
}

const NotificationLabel = styled.div`
  font-weight: 500;
`;

const NotificationDescription = styled.div`
  font-size: 14px;
  margin-top: 6px;
  display: block;
  opacity: 0.75;
`;

const MessageBox = styled.div`
  padding: 10px;
  background-color: #fbfbfb;
  border: 1px dashed #dcdcdc;
  font-size: 14px;
  line-height: 1.45;
`;

const MessageBoxActions = styled.div`
  margin-top: 2px;

  button {
    font-size: 12px;
  }
`;
