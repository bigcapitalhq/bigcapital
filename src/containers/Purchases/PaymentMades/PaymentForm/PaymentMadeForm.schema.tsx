// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  vendor_id: Yup.string().label(intl.get('vendor_name_')).required(),
  payment_date: Yup.date().required().label(intl.get('payment_date_')),
  payment_account_id: Yup.number()
    .required()
    .label(intl.get('payment_account_')),
  payment_number: Yup.string()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .nullable()
    .label(intl.get('payment_no_')),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  description: Yup.string().max(DATATYPES_LENGTH.TEXT),
  branch_id: Yup.string(),
  exchange_rate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(),
      due_amount: Yup.number().nullable(),
      payment_amount: Yup.number().nullable().max(Yup.ref('due_amount')),
      bill_id: Yup.number()
        .nullable()
        .when(['payment_amount'], {
          is: (payment_amount) => payment_amount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreatePaymentMadeFormSchema = Schema;
export const EditPaymentMadeFormSchema = Schema;
