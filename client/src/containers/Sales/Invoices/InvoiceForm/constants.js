import { moment } from 'moment';
import { repeatValue } from 'utils';

export const MIN_LINES_NUMBER = 4;

export const defaultInvoice = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
  quantity: 1,
  description: '',
  total: 0,
};

export const defaultInitialValues = {
  customer_id: '',
  invoice_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment(new Date()).format('YYYY-MM-DD'),
  delivered: '',
  invoice_no: '',
  reference_no: '',
  invoice_message: '',
  terms_conditions: '',
  entries: [...repeatValue(defaultInvoice, MIN_LINES_NUMBER)],
};
