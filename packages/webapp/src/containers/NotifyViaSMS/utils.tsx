// @ts-nocheck
import intl from 'react-intl-universal';

export const transformErrors = (errors, { setErrors, setCalloutCode }) => {
  if (errors.some((e) => e.type === 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID')) {
    setCalloutCode([200]);
    setErrors({
      customer_phone_number: 'The personal phone number is invalid.',
    });
  }
  if (errors.find((error) => error.type === 'CUSTOMER_HAS_NO_PHONE_NUMBER')) {
    setCalloutCode([100]);
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
