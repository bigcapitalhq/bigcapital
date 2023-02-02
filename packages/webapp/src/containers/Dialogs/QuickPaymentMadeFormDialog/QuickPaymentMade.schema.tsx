// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  vendor_id: Yup.string()
    .label(intl.get('vendor_name_'))
    .required(),
  payment_date: Yup.date()
    .required()
    .label(intl.get('payment_date_')),
  payment_number: Yup.string()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('payment_no_')),
  payment_account_id: Yup.number()
    .required()
    .label(intl.get('payment_account_')),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  // statement: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  branch_id: Yup.string(),
  exchange_rate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      payment_amount: Yup.number().nullable(),
      bill_id: Yup.number()
        .nullable()
        .when(['payment_amount'], {
          is: (payment_amount) => payment_amount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreateQuickPaymentMadeFormSchema = Schema;
