import moment from 'moment';
import { transformToForm, repeatValue } from 'utils';

export const MIN_LINES_NUMBER = 4;

export const defaultInvoiceEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
  quantity: 1,
  description: '',
  total: 0,
};

export const defaultInvoice = {
  customer_id: '',
  invoice_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment().format('YYYY-MM-DD'),
  delivered: '',
  invoice_no: '',
  reference_no: '',
  invoice_message: '',
  terms_conditions: '',
  entries: [...repeatValue(defaultInvoiceEntry, MIN_LINES_NUMBER)],
};

/**
 * Transform invoice to initial values in edit mode.
 */
export function transformToEditForm(invoice) {
  return {
    ...transformToForm(invoice, defaultInvoice),
    entries: [
      ...invoice.entries.map((invoice) => ({
        ...transformToForm(invoice, defaultInvoiceEntry),
      })),
      ...repeatValue(
        defaultInvoiceEntry,
        Math.max(MIN_LINES_NUMBER - invoice.entries.length, 0),
      ),
    ],
  };
}