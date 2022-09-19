// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  amount: Yup.number().required().label(intl.get('amount')),
  transaction_number: Yup.string(),
  transaction_type: Yup.string().required(),
  reference_no: Yup.string(),
  credit_account_id: Yup.number().required(),
  cashflow_account_id: Yup.string().required(),
  branch_id: Yup.string(),
  exchange_rate: Yup.number(),
  description: Yup.string()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('description')),
  publish: Yup.boolean(),
});

export const CreateMoneyOutSchema = Schema;
