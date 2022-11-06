// @ts-nocheck
import React from 'react';

import '@/style/pages/SMSMessage/SMSMessage.scss';
import { SMSMessageDialogProvider } from './SMSMessageDialogProvider';
import SMSMessageForm from './SMSMessageForm';

/**
 * SMS message dialog content.
 */
export default function SMSMessageDialogContent({
  // #ownProps
  dialogName,
  notificationkey,
}) {
  return (
    <SMSMessageDialogProvider
      dialogName={dialogName}
      notificationkey={notificationkey}
    >
      <SMSMessageForm />
    </SMSMessageDialogProvider>
  );
}
