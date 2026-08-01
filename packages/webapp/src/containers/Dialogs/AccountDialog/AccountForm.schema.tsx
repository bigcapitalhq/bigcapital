import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  name: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('account_name_')),
  code: Yup.string().nullable().min(3).max(6),
  accountType: Yup.string().required().label(intl.get('account_type')),
  description: Yup.string().min(3).max(DATATYPES_LENGTH.TEXT).nullable().trim(),
  parentAccountId: Yup.number().nullable(),
});

export const CreateAccountFormSchema = Schema;
export const EditAccountFormSchema = Schema;
