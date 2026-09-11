import intl from 'react-intl-universal';

export interface SMSNotifyApiError {
  type: string;
}

export interface TransformErrorsHelpers {
  setErrors: (errors: Record<string, string>) => void;
  setCalloutCode: (codes: number[]) => void;
}

export const transformErrors = (
  errors: SMSNotifyApiError[],
  { setErrors, setCalloutCode }: TransformErrorsHelpers,
) => {
  if (errors.some((e) => e.type === 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID')) {
    setCalloutCode([200]);
    setErrors({
      customerPhoneNumber: 'The personal phone number is invalid.',
    });
  }
  if (errors.find((error) => error.type === 'CUSTOMER_HAS_NO_PHONE_NUMBER')) {
    setCalloutCode([100]);
    setErrors({
      customerPhoneNumber: intl.get(
        'notify_via_sms.dialog.customer_no_phone_error_message',
      ),
    });
  }
};

export const getSMSUnits = (message: string, threshold = 140): number => {
  return Math.ceil(message.length / threshold);
};
