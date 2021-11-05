import React from 'react';
import intl from 'react-intl-universal';
import {
  DataTableEditable,
  DataTable,
  DashboardContentTable,
} from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { useSMSMessagesTemplatesTableColumns } from './components';

import { compose } from 'utils';

function SMSMessagesTemplatesDataTable({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  // Table columns.
  const columns = useSMSMessagesTemplatesTableColumns();

  React.useEffect(() => {
    changePreferencesPageTitle(
      intl.get('sms_message_template.label.sms_messages_template'),
    );
  }, [changePreferencesPageTitle]);

  const DATA = [
    {
      notification: 'notification',
      service: 'service',
      message: 'message',
      auto: true,
    },
    {
      notification: 'notification',
      service: 'service',
      message: 'message',
      auto: false,
    },
  ];
  return (
    <DataTableEditable
      columns={columns}
      data={[]}
      // loading={}
      // progressBarLoading={}
      TableLoadingRenderer={TableSkeletonRows}
      noInitialFetch={true}
    />
  );
}
export default compose(withDashboardActions)(SMSMessagesTemplatesDataTable);
