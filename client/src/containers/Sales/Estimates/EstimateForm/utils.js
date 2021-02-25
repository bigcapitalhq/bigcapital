import moment from 'moment';
import { repeatValue, transformToForm } from 'utils';

export const MIN_LINES_NUMBER = 4;

export const defaultEstimateEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
};

export const defaultEstimate = {
  customer_id: '',
  estimate_date: moment(new Date()).format('YYYY-MM-DD'),
  expiration_date: moment(new Date()).format('YYYY-MM-DD'),
  estimate_number: '',
  delivered: '',
  reference: '',
  note: '',
  terms_conditions: '',
  entries: [...repeatValue(defaultEstimateEntry, MIN_LINES_NUMBER)],
};

export const transformToEditForm = (estimate) => ({
  ...transformToForm(estimate, defaultEstimate),
  entries: [
    ...estimate.entries.map((estimate) => ({
      ...transformToForm(estimate, defaultEstimateEntry),
    })),
    ...repeatValue(
      defaultEstimateEntry,
      Math.max(MIN_LINES_NUMBER - estimate.entries.length, 0),
    ),
  ],
});