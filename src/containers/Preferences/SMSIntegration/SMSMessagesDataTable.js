import React from 'react';
import styled from 'styled-components';

import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useSMSIntegrationTableColumns, ActionsMenu } from './components';
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

  const handleEditMessageText = ({ key }) => {
    openDialog('sms-message-form', { notificationkey: key });
  };

  const handleEnableNotification = () => {};

  return (
    <SMSNotificationsTable
      columns={columns}
      data={notifications}
      loading={isSMSNotificationsLoading}
      progressBarLoading={isSMSNotificationsLoading}
      TableLoadingRenderer={TableSkeletonRows}
      noInitialFetch={true}
      ContextMenu={ActionsMenu}
      payload={{
        onEditMessageText: handleEditMessageText,
        onEnableNotification: handleEnableNotification,
      }}
    />
  );
}

export default compose(withDialogActions)(SMSMessagesDataTable);

const SMSNotificationsTable = styled(DataTable)`
  .table .tbody .tr .td {
    align-items: flex-start;
  }
  .table .tbody .td {
    padding: 0.8rem;
  }
`;
