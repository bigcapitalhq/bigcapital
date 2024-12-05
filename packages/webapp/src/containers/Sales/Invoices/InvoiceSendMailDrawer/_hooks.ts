import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { chain, defaultTo, mapKeys, snakeCase, startCase } from 'lodash';
import { InvoiceSendMailFormValues } from './_types';
import { useInvoiceSendMailBoot } from './InvoiceSendMailContentBoot';

export const useSendInvoiceMailForm = () => {
  return useFormikContext<InvoiceSendMailFormValues>();
};

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

export const useSendInvoiceMailFormatArgs = (): Record<string, string> => {
  const { invoiceMailState } = useInvoiceSendMailBoot();

  return useMemo(() => {
    return mapKeys(invoiceMailState?.formatArgs, (_, key) =>
      startCase(snakeCase(key).replace('_', ' ')),
    );
  }, [invoiceMailState]);
};

export const useSendInvoiceMailSubject = (): string => {
  const { values } = useFormikContext<InvoiceSendMailFormValues>();
  const formatArgs = useSendInvoiceMailFormatArgs();

  return formatSmsMessage(values?.subject, formatArgs);
};

export const useSendInvoiceFormatArgsOptions = (): Array<SelectOptionProps> => {
  const formatArgs = useSendInvoiceMailFormatArgs();

  return Object.keys(formatArgs).map((key) => ({
    value: key,
    text: key,
  }));
};

export const useSendInvoiceMailMessage = (): string => {
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

    formattedMessage = formattedMessage.replaceAll(variable, value);
  });
  return formattedMessage;
};
