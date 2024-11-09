import { castArray, first } from 'lodash';
import { transformToForm } from '@/utils';

export const initialMailNotificationValues = {
  from: [],
  to: [],
  subject: '',
  message: '',
};

export interface MailNotificationFormValues {
  from: string[];
  to: string[];
  subject: string;
  body: string;
}

export const transformMailFormToRequest = (
  values: MailNotificationFormValues,
) => {
  return {
    ...values,
    from: first(values.from),
    to: values.to?.join(', '),
  };
};

/**
 * Transforms the mail options response values to form initial values.
 * @param {any} mailOptions
 * @param {MailNotificationFormValues} initialValues
 * @returns {MailNotificationFormValues}
 */
export const transformMailFormToInitialValues = (
  mailOptions: any,
  initialValues: MailNotificationFormValues,
): MailNotificationFormValues => {
  return {
    ...initialValues,
    ...transformToForm(mailOptions, initialValues),
    from: mailOptions.from ? castArray(mailOptions.from) : [],
    to: mailOptions.to ? castArray(mailOptions.to) : [],
  };
};
