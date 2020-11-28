import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';
import { isBlank } from 'utils';

const Schema = Yup.object().shape({
  beneficiary: Yup.string().label(formatMessage({ id: 'beneficiary' })),
  payment_account_id: Yup.number()
    .required()
    .label(formatMessage({ id: 'payment_account_' })),
  payment_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'payment_date_' })),
  reference_no: Yup.string().min(1).max(DATATYPES_LENGTH.STRING),
  currency_code: Yup.string()
    .nullable()
    .max(3)
    .label(formatMessage({ id: 'currency_code' })),
  description: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .nullable()
    .label(formatMessage({ id: 'description' })),
  is_published: Yup.boolean(),
  categories: Yup.array().of(
    Yup.object().shape({
      index: Yup.number().min(1).max(DATATYPES_LENGTH.INT_10).nullable(),
      amount: Yup.number().nullable(),
      expense_account_id: Yup.number()
        .nullable()
        .when(['amount'], {
          is: (amount) => !isBlank(amount),
          then: Yup.number().required(),
        }),
      description: Yup.string().max(DATATYPES_LENGTH.TEXT).nullable(),
    }),
  ),
});

export const CreateExpenseFormSchema = Schema;
export const EditExpenseFormSchema = Schema;
