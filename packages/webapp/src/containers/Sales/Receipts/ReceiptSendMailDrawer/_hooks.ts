import { SelectOptionProps } from '@blueprintjs-formik/select';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import {
  formatMailMessage,
  transformEmailArgs,
  transformFormatArgsToOptions,
} from '../../Estimates/SendMailViewDrawer/hooks';
import { ReceiptSendMailFormValues } from './_types';
import { useReceiptSendMailBoot } from './ReceiptSendMailBoot';

/**
 * Retrieves the mail format arguments of receipt mail.
 * @returns {Record<string, string>}
 */
export const useSendReceiptMailFormatArgs = (): Record<string, string> => {
  const { receiptMailState } = useReceiptSendMailBoot();

  return useMemo(() => {
    return transformEmailArgs(receiptMailState?.formatArgs || {});
  }, [receiptMailState]);
};

/**
 * Retrieves the formatted receipt subject.
 * @returns {string}
 */
export const useSendReceiptMailSubject = (): string => {
  const { values } = useFormikContext<ReceiptSendMailFormValues>();
  const formatArgs = useSendReceiptMailFormatArgs();

  return formatMailMessage(values?.subject, formatArgs);
};

/**
 * Retrieves the estimate format options.
 * @returns {Array<SelectOptionProps>}
 */
export const useSendReceiptFormatArgsOptions = (): Array<SelectOptionProps> => {
  const formatArgs = useSendReceiptMailFormatArgs();

  return transformFormatArgsToOptions(formatArgs);
};

/**
 * Retrieves the formatted estimate message.
 * @returns {string}
 */
export const useSendReceiptMailMessage = (): string => {
  const { values } = useFormikContext<ReceiptSendMailFormValues>();
  const formatArgs = useSendReceiptMailFormatArgs();

  return formatMailMessage(values?.message, formatArgs);
};
