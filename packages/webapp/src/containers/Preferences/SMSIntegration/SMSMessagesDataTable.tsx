import { Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useSMSIntegrationTableColumns, ActionsMenu } from './components';
import {
  useSMSIntegrationContext,
  type SMSNotification,
} from './SMSIntegrationProvider';
import { DataTable, AppToaster, TableSkeletonRows } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { useSettingEditSMSNotification } from '@/hooks/query';
import { compose } from '@/utils';

type SMSMessagesDataTableInnerProps = Pick<
  WithDialogActionsProps,
  'openDialog'
>;

/**
 * SMS Message data table.
 */
function SMSMessagesDataTableInner({
  // #withDialogAction
  openDialog,
}: SMSMessagesDataTableInnerProps) {
  // Edit SMS message notification mutations.
  const { mutateAsync: editSMSNotificationMutate } =
    useSettingEditSMSNotification();

  const toggleSmsNotification = (notificationKey: string, value: boolean) => {
    editSMSNotificationMutate({
      key: notificationKey,
      values: { is_notification_enabled: value },
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
    (_event: unknown, value: boolean, notification: SMSNotification) => {
      toggleSmsNotification(notification.key, value);
    },
    [], // toggleSmsNotification is stable (closed over mutateAsync)
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
  const handleEditMessageText = ({ key }: SMSNotification) => {
    openDialog('sms-message-form', { notificationkey: key });
  };

  const handleEnableNotification = (notification: SMSNotification) => {
    toggleSmsNotification(notification.key, true);
  };

  const handleDisableNotification = (notification: SMSNotification) => {
    toggleSmsNotification(notification.key, false);
  };

  return (
    <SMSNotificationsTable
      columns={columns}
      data={notifications ?? []}
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

export const SMSMessagesDataTable = compose(withDialogActions)(
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
