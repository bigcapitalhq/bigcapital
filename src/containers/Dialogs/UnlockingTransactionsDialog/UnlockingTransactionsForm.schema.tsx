// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  module: Yup.string().required(),
  reason: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('reason')),
});
export const CreateUnlockingTransactionsFormSchema = Schema;
