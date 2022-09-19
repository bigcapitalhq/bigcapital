// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  unlock_from_date: Yup.date().required().label(intl.get('date')),
  unlock_to_date: Yup.date().required().label(intl.get('date')),
  module: Yup.string().required(),
  reason: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('reason')),
});
export const CreateUnLockingPartialTransactionsFormSchema = Schema;
