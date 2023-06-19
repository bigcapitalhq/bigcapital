// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import {
  useSettingEditSMSNotification,
  useSettingSMSNotification,
} from '@/hooks/query';

const SMSMessageDialogContext = React.createContext();

/**
 * SMS Message dialog provider.
 */
function SMSMessageDialogProvider({ notificationkey, dialogName, ...props }) {
  // Edit SMS message notification mutations.
  const { mutateAsync: editSMSNotificationMutate } =
    useSettingEditSMSNotification();

  // SMS notification details
  const { data: smsNotification, isLoading: isSMSNotificationLoading } =
    useSettingSMSNotification(notificationkey);

  //  provider.
  const provider = {
    dialogName,
    smsNotification,
    editSMSNotificationMutate,
  };

  return (
    <DialogContent isLoading={isSMSNotificationLoading}>
      <SMSMessageDialogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useSMSMessageDialogContext = () =>
  React.useContext(SMSMessageDialogContext);

export { SMSMessageDialogProvider, useSMSMessageDialogContext };
