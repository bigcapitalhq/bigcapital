import React from 'react';
import intl from 'react-intl-universal';
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { SwitchFieldCell } from 'components/DataTableCells';
import { safeCallback } from 'utils';

export function ActionsMenu({
  payload: { onEditMessageText, onEnableNotification },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        text={intl.get('edit_message_text')}
        onClick={safeCallback(onEditMessageText, original)}
      />
      <MenuItem
        text={intl.get('enable_notification')}
        onClick={safeCallback(onEnableNotification, original)}
      />
    </Menu>
  );
}

/**
 * Notification accessor.
 */
export const NotificationAccessor = (row) => {
  return (
    <span className="notification">
      <span className={'notification__label'}>{row.notification_label}</span>
      <span className={'notification__desc'}>
        {row.notification_description}
      </span>
    </span>
  );
};

export const SMSMessageCell = ({
  payload: { onEditMessageText },
  row: { original },
}) => (
  <div>
    {original.sms_message}
    <span
      className="edit-text"
      onClick={safeCallback(onEditMessageText, original)}
    >
      {'Edit'}
    </span>
  </div>
);

export function useSMSIntegrationTableColumns() {
  return React.useMemo(() => [
    {
      Header: intl.get('sms_messages.label_notification'),
      accessor: NotificationAccessor,
      className: 'notification',
      width: '180',
      disableSortBy: true,
    },
    {
      Header: intl.get('service'),
      accessor: 'module_formatted',
      className: 'service',
      width: '80',
      disableSortBy: true,
    },
    {
      Header: intl.get('sms_messages.label_mesage'),
      accessor: 'sms_message',
      Cell: SMSMessageCell,
      className: 'sms_message',
      clickable: true,
      width: '180',
      disableSortBy: true,
    },
    {
      Header: intl.get('sms_messages.label_auto'),
      accessor: 'is_notification_enabled',
      Cell: SwitchFieldCell,
      className: 'is_notification_enabled',
      disableSortBy: true,
      disableResizing: true,
      width: '80',
    },
  ]);
}
