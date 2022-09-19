// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  amount: Yup.number().required(),
  reference_no: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  deposit_account_id: Yup.number()
    .required()
    .label(intl.get('deposit_account_')),
  description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  exchange_rate: Yup.number(),
});
export const CreateVendorRefundCreditFormSchema = Schema;
