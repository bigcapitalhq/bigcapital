import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import intl from 'react-intl-universal';

export const transformErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID')) {
    AppToaster.show({
      message: intl.get('notify_via_sms.dialog.phone_invalid_error_message'),
      intent: Intent.DANGER,
    });
  }

  if (errors.find((error) => error.type === 'CUSTOMER_HAS_NO_PHONE_NUMBER')) {
    setErrors({
      customer_phone_number: intl.get(
        'notify_via_sms.dialog.customer_no_phone_error_message',
      ),
    });
  }
};


export const getSMSUnits = (message, threshold = 140) => {
  return Math.ceil(message.length / threshold);
};