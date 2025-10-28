import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { usePaymentReceivedSendMailBoot } from './PaymentReceivedMailBoot';
import { PaymentReceivedSendMailFormValues } from './_types';
import {
  formatMailMessage,
  transformEmailArgs,
  transformFormatArgsToOptions,
} from '../../Estimates/SendMailViewDrawer/hooks';

/**
 * Retrieves the mail format arguments of payment received mail.
 * @returns {Record<string, string>}
 */
export const usePaymentReceivedMailFormatArgs = (): Record<string, string> => {
  const { paymentReceivedMailState } = usePaymentReceivedSendMailBoot();

  return useMemo(() => {
    return transformEmailArgs(paymentReceivedMailState?.formatArgs || {});
  }, [paymentReceivedMailState]);
};

/**
 * Retrieves the formatted receipt subject.
 * @returns {string}
 */
export const usePaymentReceivedMailSubject = (): string => {
  const { values } = useFormikContext<PaymentReceivedSendMailFormValues>();
  const formatArgs = usePaymentReceivedMailFormatArgs();

  return formatMailMessage(values?.subject, formatArgs);
};

/**
 * Retrieves the payment received format options.
 * @returns {Array<SelectOptionProps>}
 */
export const usePaymentReceivedFormatArgsOptions =
  (): Array<SelectOptionProps> => {
    const formatArgs = usePaymentReceivedMailFormatArgs();

    return transformFormatArgsToOptions(formatArgs);
  };

/**
 * Retrieves the formatted estimate message.
 * @returns {string}
 */
export const useSendPaymentReceivedtMailMessage = (): string => {
  const { values } = useFormikContext<PaymentReceivedSendMailFormValues>();
  const formatArgs = usePaymentReceivedMailFormatArgs();

  return formatMailMessage(values?.message, formatArgs);
};
