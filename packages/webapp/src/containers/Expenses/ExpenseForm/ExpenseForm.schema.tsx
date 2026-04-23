// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const Schema = Yup.object().shape({
  beneficiary: Yup.string().label(intl.get('beneficiary')),
  payment_date: Yup.date().required().label(intl.get('payment_date_')),
  reference_no: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  currency_code: Yup.string()
    .nullable()
    .max(3)
    .label(intl.get('currency_code')),
  description: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .nullable()
    .label(intl.get('description')),
  publish: Yup.boolean(),
  payment_splits: Yup.array()
    .of(
      Yup.object().shape({
        payment_account_id: Yup.number().nullable(),
        amount: Yup.number().nullable(),
      }),
    )
    .test(
      'at-least-one-payment',
      intl.get('at_least_one_payment_required') ||
        'At least one payment is required',
      (splits) =>
        (splits || []).some(
          (s) => s && s.payment_account_id && Number(s.amount) > 0,
        ),
    )
    .test(
      'payment-row-complete',
      intl.get('payment_row_must_have_account_and_amount') ||
        'Payment rows must include both an account and an amount.',
      (splits) =>
        (splits || []).every((s) => {
          const hasId = s && !isBlank(s.payment_account_id);
          const hasAmt = s && !isBlank(s.amount) && Number(s.amount) > 0;
          return hasId === hasAmt;
        }),
    ),
  categories: Yup.array().of(
    Yup.object().shape({
      index: Yup.number().min(1).max(DATATYPES_LENGTH.INT_10).nullable(),
      amount: Yup.number().nullable(),
      amount_type: Yup.string().oneOf(['fixed', 'percent']).nullable(),
      percent: Yup.number().nullable(),
      expense_account_id: Yup.number()
        .nullable()
        .when(['amount', 'amount_type', 'percent'], {
          is: (amount, amountType, percent) =>
            (amountType === 'percent' && !isBlank(percent)) ||
            (amountType !== 'percent' && !isBlank(amount)),
          then: Yup.number().required(),
        }),
      landed_cost: Yup.boolean(),
      description: Yup.string().max(DATATYPES_LENGTH.TEXT).nullable(),
      project_id: Yup.number().nullable(),
    }),
  ),
});

export const CreateExpenseFormSchema = Schema;
export const EditExpenseFormSchema = Schema;
