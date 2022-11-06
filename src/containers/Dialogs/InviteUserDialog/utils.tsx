// @ts-nocheck
import intl from 'react-intl-universal';

export const transformApiErrors = (errors) => {
  const fields = {};

  if (errors.find((error) => error.type === 'EMAIL.ALREADY.INVITED')) {
    fields.email = intl.get('email_is_already_used');
  }
  if (errors.find((error) => error.type === 'EMAIL.ALREADY.EXISTS')) {
    fields.email = intl.get('email_is_already_used');
  }
  return fields;
};
