// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  expense_account_id: Yup.number()
    .required()
    .label(intl.get('expense_account_id')),
  amount: Yup.number().required().label(intl.get('amount')),
  reason: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('reason')),
});

export const CreateBadDebtFormSchema = Schema;
