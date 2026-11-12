import { Intent } from '@blueprintjs/core';
import moment from 'moment';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

const DATE_FORMAT = 'YYYY-MM-DD';

interface ResponseError {
  type: string;
}

interface TransformErrorsArgs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setErrors: any;
}

/**
 * Transformes the response errors types.
 */
export const transformErrors = (
  errors: ResponseError[],
  { setErrors }: TransformErrorsArgs,
) => {
  if (errors.some(({ type }) => type === 'SALE_INVOICE_ALREADY_WRITTEN_OFF')) {
    AppToaster.show({
      message: 'SALE_INVOICE_ALREADY_WRITTEN_OFF',
      // message: intl.get(''),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.some(
      ({ type }) => type === 'SALE_INVOICE_WRITEOFF_DATE_BEFORE_INVOICE_DATE',
    )
  ) {
    setErrors({ date: intl.get('bad_debt.dialog.date_before_invoice_date') });
  }
};

/**
 * Retrieves the latest date the invoice can be written off on from the
 * dialog: today, or the invoice date when the invoice is dated after today.
 * It is also the default write-off date.
 * @param {string} invoiceDate - The invoice date (YYYY-MM-DD).
 * @returns {string} The date (YYYY-MM-DD).
 */
export const getLatestWriteoffDate = (invoiceDate?: string): string => {
  const today = moment().format(DATE_FORMAT);

  return invoiceDate && invoiceDate > today ? invoiceDate : today;
};

/**
 * Parses a `YYYY-MM-DD` calendar date as local midnight of that day.
 * @param {string} value - The calendar date.
 * @returns {Date | undefined}
 */
export const parseCalendarDate = (value?: string): Date | undefined =>
  value ? moment(value, DATE_FORMAT).toDate() : undefined;
