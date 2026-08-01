import React, { createContext } from 'react';
import type { SMSMessageDialogContextValue, SMSNotification } from './types';
import { DialogContent } from '@/components';
import {
  useSettingEditSMSNotification,
  useSettingSMSNotification,
} from '@/hooks/query';

const SMSMessageDialogContext = createContext<SMSMessageDialogContextValue>(
  {} as SMSMessageDialogContextValue,
);

interface SMSMessageDialogProviderProps {
  notificationkey: string;
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * SMS Message dialog provider.
 */
function SMSMessageDialogProvider({
  notificationkey,
  dialogName,
  ...props
}: SMSMessageDialogProviderProps) {
  // Edit SMS message notification mutations.
  const { mutateAsync: editSMSNotificationMutate } =
    useSettingEditSMSNotification();

  // SMS notificiation details. SDK leaves this typed as `unknown`; cast narrow.
  const { data: smsNotificationRaw, isLoading: isSMSNotificationLoading } =
    useSettingSMSNotification(notificationkey);
  const smsNotification =
    (smsNotificationRaw as SMSNotification | undefined) ??
    ({} as SMSNotification);

  //  provider.
  const provider: SMSMessageDialogContextValue = {
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
