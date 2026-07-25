import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const Schema = Yup.object().shape({
  beneficiary: Yup.string().label(intl.get('beneficiary')),
  paymentAccountId: Yup.number().required().label(intl.get('payment_account_')),
  paymentDate: Yup.date().required().label(intl.get('payment_date_')),
  referenceNo: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  currencyCode: Yup.string().nullable().max(3).label(intl.get('currency_code')),
  description: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .nullable()
    .label(intl.get('description')),
  publish: Yup.boolean(),
  categories: Yup.array().of(
    Yup.object().shape({
      index: Yup.number().min(1).max(DATATYPES_LENGTH.INT_10).nullable(),
      amount: Yup.number().nullable(),
      expenseAccountId: Yup.number()
        .nullable()
        .when(['amount'], {
          is: (amount) => !isBlank(amount),
          then: Yup.number().required(),
        }),
      landedCost: Yup.boolean(),
      description: Yup.string().max(DATATYPES_LENGTH.TEXT).nullable(),
      projectId: Yup.number().nullable(),
    }),
  ),
});

export const CreateExpenseFormSchema = Schema;
export const EditExpenseFormSchema = Schema;
