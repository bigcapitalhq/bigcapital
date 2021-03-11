import moment from 'moment';
import { safeSumBy, transformToForm } from 'utils';

export const ERRORS = {
  PAYMENT_NUMBER_NOT_UNIQUE: 'PAYMENT.NUMBER.NOT.UNIQUE',
};

// Default payment made entry values.
export const defaultPaymentMadeEntry = {
  bill_id: '',
  payment_amount: '',
  id: null,
  due_amount: null,
};

// Default initial values of payment made.
export const defaultPaymentMade = {
  full_amount: '',
  vendor_id: '',
  payment_account_id: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  reference: '',
  payment_number: '',
  statement: '',
  entries: [],
};

export const transformToEditForm = (paymentMade, paymentMadeEntries) => {
  return {
    ...transformToForm(paymentMade, defaultPaymentMade),
    full_amount: safeSumBy(paymentMadeEntries, 'payment_amount'),
    entries: [
      ...paymentMadeEntries.map((paymentMadeEntry) => ({
        ...transformToForm(paymentMadeEntry, defaultPaymentMadeEntry),
        payment_amount: paymentMadeEntry.payment_amount || '',
      })),
    ],
  };
};

/**
 * Transform the new page entries.
 */
export const transformToNewPageEntries = (entries) => {
  return entries.map((entry) => ({
    ...transformToForm(entry, defaultPaymentMadeEntry),
    payment_amount: '',
  }));
}