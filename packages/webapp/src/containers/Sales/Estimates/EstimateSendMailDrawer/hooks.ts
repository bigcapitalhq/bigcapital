import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { useEstimateSendMailBoot } from './EstimateSendMailBoot';
import {
  formatMailMessage,
  transformEmailArgs,
  transformFormatArgsToOptions,
} from '../SendMailViewDrawer/hooks';
import { EstimateSendMailFormValues } from './_interfaces';

/**
 * Retrieves the mail format arguments of estimate mail.
 * @returns {Record<string, string>}
 */
export const useSendEstimateMailFormatArgs = (): Record<string, string> => {
  const { estimateMailState } = useEstimateSendMailBoot();

  return useMemo(() => {
    return transformEmailArgs(estimateMailState?.formatArgs || {});
  }, [estimateMailState]);
};

/**
 * Retrieves the formatted estimate subject.
 * @returns {string}
 */
export const useSendEstimateMailSubject = (): string => {
  const { values } = useFormikContext<EstimateSendMailFormValues>();
  const formatArgs = useSendEstimateMailFormatArgs();

  return formatMailMessage(values?.subject, formatArgs);
};

/**
 * Retrieves the estimate format options.
 * @returns {Array<SelectOptionProps>}
 */
export const useSendEstimateFormatArgsOptions =
  (): Array<SelectOptionProps> => {
    const formatArgs = useSendEstimateMailFormatArgs();

    return transformFormatArgsToOptions(formatArgs);
  };

/**
 * Retrieves the formatted estimate message.
 * @returns {string}
 */
export const useSendEstimateMailMessage = (): string => {
  const { values } = useFormikContext<EstimateSendMailFormValues>();
  const formatArgs = useSendEstimateMailFormatArgs();

  return formatMailMessage(values?.message, formatArgs);
};
