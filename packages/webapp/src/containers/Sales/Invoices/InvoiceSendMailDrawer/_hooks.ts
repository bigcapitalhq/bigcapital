import { useFormikContext } from 'formik';
import { camelCase, chain, defaultTo, mapKeys, upperFirst } from 'lodash';
import { InvoiceSendMailFormValues } from './_types';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';
import { useMemo } from 'react';

export const useInvoiceMailItems = () => {
  const { values } = useFormikContext<InvoiceSendMailFormValues>();
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

export const useSendInvoiceMailFormatArgs = () => {
  const { invoiceMailOptions } = useInvoiceSendMailBoot();

  return useMemo(() => {
    return mapKeys(invoiceMailOptions?.formatArgs, (_, key) =>
      upperFirst(camelCase(key)),
    );
  }, [invoiceMailOptions]);
};

export const useSendInvoiceMailSubject = () => {
  const { values } = useFormikContext<InvoiceSendMailFormValues>();
  const formatArgs = useSendInvoiceMailFormatArgs();

  return formatSmsMessage(values?.subject, formatArgs);
};

export const useSendInvoiceMailMessage = () => {
  const { values } = useFormikContext<InvoiceSendMailFormValues>();
  const formatArgs = useSendInvoiceMailFormatArgs();

  return formatSmsMessage(values?.message, formatArgs);
};

export const formatSmsMessage = (
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
