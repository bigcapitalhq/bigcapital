import { formatMessage } from 'services/intl';

export const transformApiErrors = (errors) => {
  const fields = {};

  if (errors.find((error) => error.type === 'EMAIL.ALREADY.INVITED')) {
    fields.email = formatMessage({ id: 'email_is_already_used' });
  }
  if (errors.find((error) => error.type === 'EMAIL.ALREADY.EXISTS')) {
    fields.email = formatMessage({ id: 'email_is_already_used' });
  }
  return fields;
};
