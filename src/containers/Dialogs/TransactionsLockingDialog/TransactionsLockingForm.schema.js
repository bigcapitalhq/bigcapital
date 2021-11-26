import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  reason: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('reason')),
});
export const CreateTransactionsLockingFormSchema = Schema;
