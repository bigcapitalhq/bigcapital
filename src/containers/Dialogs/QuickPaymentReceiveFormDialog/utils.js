import moment from 'moment';
import intl from 'react-intl-universal';

export const defaultInitialValues = {
  customer_id: '',
  deposit_account_id: '',
  payment_receive_no: '',
  payment_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  // statement: '',
  entries: [{ invoice_id: '', payment_amount: '' }],
};

export const transformErrors = (errors, { setFieldError }) => {
  const getError = (errorType) => errors.find((e) => e.type === errorType);

  if (getError('PAYMENT_RECEIVE_NO_EXISTS')) {
    setFieldError(
      'payment_receive_no',
      intl.get('payment_number_is_not_unique'),
    );
  }
  if (getError('PAYMENT_RECEIVE_NO_REQUIRED')) {
    setFieldError(
      'payment_receive_no',
      intl.get('payment_receive_number_required'),
    );
  }
  if (getError('INVALID_PAYMENT_AMOUNT')) {
    setFieldError(
      'payment_amount',
      intl.get('the_payment_amount_bigger_than_invoice_due_amount'),
    );
  }
};
