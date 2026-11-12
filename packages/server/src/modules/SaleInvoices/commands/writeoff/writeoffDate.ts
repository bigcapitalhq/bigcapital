import * as moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Resolves the date an invoice write-off is posted on.
 * - A requested date is kept as the calendar day it was written with, even
 *   when it carries a time and an offset.
 * - Without a requested date, the write-off is posted today, or on the
 *   invoice date when the invoice is dated after today.
 * @param {string} requestedDate - The write-off date sent by the client.
 * @param {Date | string} invoiceDate - The invoice date.
 * @param {string} today - Today's date (YYYY-MM-DD).
 * @returns {string} The write-off date (YYYY-MM-DD).
 */
export const resolveWriteoffDate = (
  requestedDate: string | undefined,
  invoiceDate: Date | string,
  today: string = moment().format(DATE_FORMAT),
): string => {
  if (requestedDate) {
    return moment.parseZone(requestedDate).format(DATE_FORMAT);
  }
  const invoiceDay = moment(invoiceDate).format(DATE_FORMAT);

  return invoiceDay > today ? invoiceDay : today;
};

/**
 * Determines whether the write-off date falls before the invoice date.
 * @param {string} writeoffDate - The write-off date.
 * @param {Date | string} invoiceDate - The invoice date.
 * @returns {boolean}
 */
export const isWriteoffDateBeforeInvoiceDate = (
  writeoffDate: string,
  invoiceDate: Date | string,
): boolean => moment(writeoffDate).isBefore(moment(invoiceDate), 'day');
