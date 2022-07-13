import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  exchange_rate: Yup.number()
    .required()
    .label(intl.get('exchange_rate_')),
  currency_code: Yup.string()
    .max(3)
    .required(intl.get('currency_code_')),
  date: Yup.date()
    .required()
    .label(intl.get('date')),
});

export const CreateExchangeRateFormSchema = Schema;
export const EditExchangeRateFormSchema = Schema;
