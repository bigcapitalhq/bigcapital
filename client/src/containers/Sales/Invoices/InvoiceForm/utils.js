import moment from 'moment';
import { compose, transformToForm, repeatValue } from 'utils';
import { updateItemsEntriesTotal } from 'containers/Entries/utils';
import { ERROR } from 'common/errors';

import { Intent } from '@blueprintjs/core';
import { formatMessage } from 'services/intl';
import { AppToaster } from 'components';

export const MIN_LINES_NUMBER = 4;

// Default invoice entry object.
export const defaultInvoiceEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  total: 0,
};

// Default invoice object.
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
  const entries = compose(updateItemsEntriesTotal)([
    ...invoice.entries.map((invoice) => ({
      ...transformToForm(invoice, defaultInvoiceEntry),
    })),
    ...repeatValue(
      defaultInvoiceEntry,
      Math.max(MIN_LINES_NUMBER - invoice.entries.length, 0),
    ),
  ]);

  return {
    ...transformToForm(invoice, defaultInvoice),
    entries,
  };
}

export const transformErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === ERROR.SALE_INVOICE_NUMBER_IS_EXISTS)) {
    setErrors({
      invoice_no: formatMessage({ id: 'sale_invoice_number_is_exists' }),
    });
  }
  if (
    errors.some(
      ({ type }) =>
        type === ERROR.SALE_ESTIMATE_IS_ALREADY_CONVERTED_TO_INVOICE,
    )
  ) {
    AppToaster.show({
      message: formatMessage({
        id: 'sale_estimate_is_already_converted_to_invoice',
      }),
      intent: Intent.DANGER,
    });
  }
};
