import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  amount: Yup.number().required().label(intl.get('amount')),
  transactionNumber: Yup.string(),
  transactionType: Yup.string().required(),
  referenceNo: Yup.string(),
  creditAccountId: Yup.number().required(),
  cashflowAccountId: Yup.string().required(),
  branchId: Yup.string(),
  exchangeRate: Yup.number(),

  description: Yup.string()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('description')),
  publish: Yup.boolean(),
});

export const CreateMoneyInFormSchema = Schema;
