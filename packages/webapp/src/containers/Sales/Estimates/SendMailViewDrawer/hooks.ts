import { useFormikContext } from 'formik';
import { chain, defaultTo, mapKeys, snakeCase, startCase } from 'lodash';
import { SendMailViewFormValues } from './_types';

export const useSendInvoiceMailForm = () => {
  return useFormikContext<SendMailViewFormValues>();
};

/**
 * Retrieves the suggest items of to, cc and bcc fields.
 * @returns {Array<{ value: string, text: string }>}
 */
export const useSendMailItems = (): Array<{ value: string; text: string }> => {
  const { values } = useSendInvoiceMailForm();
  const cc = values?.cc || [];
  const bcc = values?.bcc || [];

  return chain([...values?.to, ...cc, ...bcc])
    .filter((email) => !!email?.trim())
    .uniq()
    .map((email) => ({
      value: email,
      text: email,
    }))
    .value();
};

export const transformEmailArgs = (formatArgs: Record<string, string>) => {
  return mapKeys(formatArgs, (_, key) =>
    startCase(snakeCase(key).replace('_', ' ')),
  );
};

export const transformFormatArgsToOptions = (
  formatArgs: Record<string, string>,
) => {
  return Object.keys(formatArgs).map((key) => ({
    value: key,
    text: key,
  }));
};

export const formatMailMessage = (
  message: string,
  args: Record<string, any>,
) => {
  let formattedMessage = message;

  Object.keys(args).forEach((key) => {
    const variable = `{${key}}`;
    const value = defaultTo(args[key], '');

    formattedMessage = formattedMessage.replace(variable, value);
  });
  return formattedMessage;
};
