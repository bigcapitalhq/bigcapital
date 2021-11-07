import React from 'react';
import intl from 'react-intl-universal';
import { SwitchFieldCell } from 'components/DataTableCells';
import { safeCallback } from 'utils';

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
  payload: { onEditSMSMessage },
  row: { original },
}) => (
  <div>
    {original.sms_message}
    <span
      className="edit-text"
      onClick={safeCallback(onEditSMSMessage, original)}
    >
      {'Edit'}
    </span>
  </div>
);

export function useSMSIntegrationTableColumns() {
  return React.useMemo(() => [
    {
      Header: intl.get('sms_message.label_Notification'),
      accessor: NotificationAccessor,
      className: 'notification',
      width: '180',
    },
    {
      Header: intl.get('service'),
      accessor: 'module_formatted',
      className: 'service',
      width: '80',
    },
    {
      Header: intl.get('sms_message.label_mesage'),
      accessor: 'sms_message',
      Cell: SMSMessageCell,
      className: 'sms_message',
      clickable: true,
      width: '180',
    },
    {
      Header: intl.get('sms_message.label_auto'),
      accessor: 'is_notification_enabled',
      Cell: SwitchFieldCell,
      className: 'is_notification_enabled',
      disableSortBy: true,
      disableResizing: true,
      width: '80',
    },
  ]);
}
