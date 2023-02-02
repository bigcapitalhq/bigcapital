// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  currency_name: Yup.string()
    .required()
    .label(intl.get('currency_name_')),
  currency_code: Yup.string()
    .max(4)
    .required()
    .label(intl.get('currency_code_')),
  currency_sign: Yup.string().required(),
});

export const CreateCurrencyFormSchema = Schema;
export const EditCurrencyFormSchema = Schema;
