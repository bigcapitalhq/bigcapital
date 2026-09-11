import { SelectOptionProps } from '@blueprintjs-formik/select';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import {
  formatMailMessage,
  transformEmailArgs,
  transformFormatArgsToOptions,
} from '../../Estimates/SendMailViewDrawer/hooks';
import { CreditNoteSendMailFormValues } from './_types';
import { useCreditNoteSendMailBoot } from './CreditNoteSendMailBoot';

/**
 * Retrieves the mail format arguments of credit note mail.
 * @returns {Record<string, string>}
 */
export const useSendCreditNoteMailFormatArgs = (): Record<string, string> => {
  const { creditNoteMailState } = useCreditNoteSendMailBoot();

  return useMemo(() => {
    return transformEmailArgs(creditNoteMailState?.formatArgs || {});
  }, [creditNoteMailState]);
};

/**
 * Retrieves the formatted credit note subject.
 * @returns {string}
 */
export const useSendCreditNoteMailSubject = (): string => {
  const { values } = useFormikContext<CreditNoteSendMailFormValues>();
  const formatArgs = useSendCreditNoteMailFormatArgs();

  return formatMailMessage(values?.subject, formatArgs);
};

/**
 * Retrieves the credit note format options.
 * @returns {Array<SelectOptionProps>}
 */
export const useSendCreditNoteFormatArgsOptions =
  (): Array<SelectOptionProps> => {
    const formatArgs = useSendCreditNoteMailFormatArgs();

    return transformFormatArgsToOptions(formatArgs);
  };

/**
 * Retrieves the formatted credit note message.
 * @returns {string}
 */
export const useSendCreditNoteMailMessage = (): string => {
  const { values } = useFormikContext<CreditNoteSendMailFormValues>();
  const formatArgs = useSendCreditNoteMailFormatArgs();

  return formatMailMessage(values?.message, formatArgs);
};
