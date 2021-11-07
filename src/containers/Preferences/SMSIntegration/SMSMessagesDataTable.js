import React from 'react';
import { DataTableEditable, DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useSMSIntegrationTableColumns } from './components';
import { useSMSIntegrationContext } from './SMSIntegrationProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

function SMSMessagesDataTable({
  // #withDialogAction
  openDialog,
}) {
  // Table columns.
  const columns = useSMSIntegrationTableColumns();

  const { notifications, isSMSNotificationsLoading } =
    useSMSIntegrationContext();

  const handleEditSMSMessage = ({ key }) => {
    openDialog('sms-message-form', { notificationkey: key });
  };

  return (
    <DataTable
      columns={columns}
      data={notifications}
      loading={isSMSNotificationsLoading}
      progressBarLoading={isSMSNotificationsLoading}
      TableLoadingRenderer={TableSkeletonRows}
      noInitialFetch={true}
      payload={{
        onEditSMSMessage: handleEditSMSMessage,
      }}
    />
  );
}

export default compose(withDialogActions)(SMSMessagesDataTable);
