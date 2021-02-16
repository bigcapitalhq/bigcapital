import moment from 'moment';
import { transformToForm } from 'utils';

// Default payment receive entry.
export const defaultPaymentReceiveEntry = {
  id: '',
  payment_amount: '',
  invoice_id: '',
  due_amount: '',
};

// Form initial values.
export const defaultPaymentReceive = {
  customer_id: '',
  deposit_account_id: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  payment_receive_no: '',
  description: '',
  full_amount: '',
  entries: [],
};

export const transformToEditForm = (paymentReceive, paymentReceiveEntries) => {
  return {
    ...transformToForm(paymentReceive, defaultPaymentReceive),
    entries: [
      ...paymentReceiveEntries.map((paymentReceiveEntry) => ({
        ...transformToForm(paymentReceiveEntry, defaultPaymentReceiveEntry),
      })),
    ],
  };
};
