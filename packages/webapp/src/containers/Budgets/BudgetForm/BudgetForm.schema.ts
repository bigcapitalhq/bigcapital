import moment from 'moment';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { parseAmount } from './utils';
import type { BudgetFormValues } from './types';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

export const BudgetFormSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('budget.form.name')),
  description: Yup.string().trim().max(DATATYPES_LENGTH.TEXT),
  fromDate: Yup.date()
    .required()
    .typeError(intl.get('budget.form.date_invalid')),
  toDate: Yup.date()
    .required()
    .typeError(intl.get('budget.form.date_invalid'))
    .test(
      'budget-date-range',
      intl.get('budget.form.date_range_error'),
      function (toDate) {
        const { fromDate } = this.parent as BudgetFormValues;

        if (!fromDate || !toDate) {
          return true;
        }
        return !moment(toDate).isBefore(fromDate, 'month');
      },
    ),
  entries: Yup.object().test(
    'budget-at-least-one-entry',
    intl.get('budget.form.entries_required'),
    (entries) =>
      Object.values((entries ?? {}) as Record<string, string>).some(
        (value) => parseAmount(value) > 0,
      ),
  ),
});
