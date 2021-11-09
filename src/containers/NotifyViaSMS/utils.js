import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import intl from 'react-intl-universal';

export const transformErrors = (errors) => {
  if (errors.some((e) => e.type === 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID')) {
    AppToaster.show({
      message: intl.get('notify_via_sms.dialog.error_message'),
      intent: Intent.DANGER,
    });
  }
};


export const getSMSUnits = (message, threshold = 140) => {
  return Math.ceil(message.length / threshold);
};