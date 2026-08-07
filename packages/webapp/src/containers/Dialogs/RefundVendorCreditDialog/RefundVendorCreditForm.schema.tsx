import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  amount: Yup.number().required(),
  referenceNo: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  depositAccountId: Yup.number().required().label(intl.get('deposit_account_')),
  description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  exchangeRate: Yup.number(),
});
export const CreateVendorRefundCreditFormSchema = Schema;
