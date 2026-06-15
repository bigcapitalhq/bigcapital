// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';

import { DataTable, AppToaster, TableSkeletonRows } from '@/components';

import { useSMSIntegrationTableColumns, ActionsMenu } from './components';
import { useSMSIntegrationContext } from './SMSIntegrationProvider';
import { useSettingEditSMSNotification } from '@/hooks/query';

import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

/**
 * SMS Message data table.
 */
function SMSMessagesDataTableInner({
  // #withDialogAction
  openDialog,
}) {
  // Edit SMS message notification mutations.
  const { mutateAsync: editSMSNotificationMutate } =
    useSettingEditSMSNotification();

  const toggleSmsNotification = (notificationKey, value) => {
    editSMSNotificationMutate({
      notification_key: notificationKey,
      is_notification_enabled: value,
    }).then(() => {
      AppToaster.show({
        message: intl.get(
          'sms_messages.notification_switch_change_success_message',
        ),
        intent: Intent.SUCCESS,
      });
    });
  };

  // Handle notification switch change.
  const handleNotificationSwitchChange = React.useCallback(
    (event, value, notification) => {
      toggleSmsNotification(notification.key, value);
    },
    [editSMSNotificationMutate],
  );

  // Table columns.
  const columns = useSMSIntegrationTableColumns({
    onSwitchChange: handleNotificationSwitchChange,
  });

  const {
    notifications,
    isSMSNotificationsLoading,
    isSMSNotificationsFetching,
  } = useSMSIntegrationContext();

  // handle edit message link click
  const handleEditMessageText = ({ key }) => {
    openDialog('sms-message-form', { notificationkey: key });
  };

  const handleEnableNotification = (notification) => {
    toggleSmsNotification(notification.key, true);
  };

  const handleDisableNotification = (notification) => {
    toggleSmsNotification(notification.key, false);
  };

  return (
    <SMSNotificationsTable
      columns={columns}
      data={notifications}
      loading={isSMSNotificationsLoading}
      progressBarLoading={isSMSNotificationsFetching}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionsMenu}
      payload={{
        onEditMessageText: handleEditMessageText,
        onEnableNotification: handleEnableNotification,
        onDisableNotification: handleDisableNotification,
      }}
    />
  );
}

export const SMSMessagesDataTable = flow(withDialogActions)(
  SMSMessagesDataTableInner,
);

const SMSNotificationsTable = styled(DataTable)`
  .table .tbody .tr .td {
    align-items: flex-start;
  }
  .table .tbody .td {
    padding: 0.8rem;
  }
`;
