import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';

import { DataTable, AppToaster } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useSMSIntegrationTableColumns, ActionsMenu } from './components';
import { useSMSIntegrationContext } from './SMSIntegrationProvider';
import { useSettingEditSMSNotification } from 'hooks/query';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * SMS Message data table.
 */
function SMSMessagesDataTable({
  // #withDialogAction
  openDialog,
}) {
  // Edit SMS message notification mutations.
  const { mutateAsync: editSMSNotificationMutate } =
    useSettingEditSMSNotification();

  // Handle notification switch change.
  const handleNotificationSwitchChange = React.useCallback(
    (event, value, notification) => {
      editSMSNotificationMutate({
        notification_key: notification.key,
        is_notification_enabled: value,
      }).then(() => {
        AppToaster.show({
          message: intl.get(
            'sms_messages.notification_switch_change_success_message',
          ),
          intent: Intent.SUCCESS,
        });
      });
    },
    [editSMSNotificationMutate],
  );

  // Table columns.
  const columns = useSMSIntegrationTableColumns({
    onSwitchChange: handleNotificationSwitchChange,
  });

  const { notifications, isSMSNotificationsLoading } =
    useSMSIntegrationContext();

  // handle edit message link click
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
