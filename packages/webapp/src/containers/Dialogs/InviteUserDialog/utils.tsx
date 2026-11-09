import intl from 'react-intl-universal';

interface ResponseError {
  type: string;
}

export const transformApiErrors = (errors: ResponseError[]) => {
  const fields: Record<string, string> = {};

  if (errors.find((error) => error.type === 'EMAIL.ALREADY.INVITED')) {
    fields.email = intl.get('email_is_already_used');
  }
  if (errors.find((error) => error.type === 'EMAIL.ALREADY.EXISTS')) {
    fields.email = intl.get('email_is_already_used');
  }
  return fields;
};
