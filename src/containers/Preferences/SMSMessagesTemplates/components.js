import React from 'react';
import intl from 'react-intl-universal';

import {
  InputGroupCell,
  TextAreaCell,
  SwitchFieldCell,
} from 'components/DataTableCells';

export function useSMSMessagesTemplatesTableColumns() {
  return React.useMemo(() => [
    {
      Header: intl.get('sms_message_template.label_Notification'),
      accessor: 'notification',
      className: 'notification',
      width: '150',
    },
    {
      Header: intl.get('service'),
      accessor: 'service',
      className: 'service',
      width: '100',
    },
    {
      Header: intl.get('sms_message_template.label_mesage'),
      accessor: 'message',
      className: 'message',
      width: '180',
    },
    {
      Header: intl.get('sms_message_template.label_auto'),
      accessor: 'auto',
      Cell: SwitchFieldCell,
      className: 'auto',
      disableSortBy: true,
      disableResizing: true,
      width: '80',
    },
  ]);
}
