import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  unlockFromDate: Yup.date().required().label(intl.get('date')),
  unlockToDate: Yup.date().required().label(intl.get('date')),
  module: Yup.string().required(),
  reason: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('reason')),
});
export const CreateUnLockingPartialTransactionsFormSchema = Schema;
