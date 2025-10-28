// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  customer_id: Yup.string().label(intl.get('customer_name_')).required(),
  payment_receive_no: Yup.string()
    .required()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('payment_received_no_')),
  payment_date: Yup.date().required().label(intl.get('payment_date_')),
  deposit_account_id: Yup.number()
    .required()
    .label(intl.get('deposit_account_')),
  reference_no: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  // statement: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  branch_id: Yup.string(),
  exchange_rate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      payment_amount: Yup.number().nullable(),
      invoice_id: Yup.number()
        .nullable()
        .when(['payment_amount'], {
          is: (payment_amount) => payment_amount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreateQuickPaymentReceiveFormSchema = Schema;
