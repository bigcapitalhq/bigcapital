import React from 'react';
import '@/style/pages/SMSMessage/SMSMessage.scss';
import { SMSMessageDialogProvider } from './SMSMessageDialogProvider';
import { SMSMessageForm } from './SMSMessageForm';

interface SMSMessageDialogContentProps {
  dialogName: string;
  notificationkey: string;
}

/**
 * SMS message dialog content.
 */
export function SMSMessageDialogContent({
  dialogName,
  notificationkey,
}: SMSMessageDialogContentProps): React.ReactElement {
  return (
    <SMSMessageDialogProvider
      dialogName={dialogName}
      notificationkey={notificationkey}
    >
      <SMSMessageForm />
    </SMSMessageDialogProvider>
  );
}
