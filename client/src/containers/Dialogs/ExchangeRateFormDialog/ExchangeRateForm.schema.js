import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  exchange_rate: Yup.number()
    .required()
    .label(formatMessage({ id: 'exchange_rate_' })),
  currency_code: Yup.string()
    .max(3)
    .required(formatMessage({ id: 'currency_code_' })),
  date: Yup.date()
    .required()
    .label(formatMessage({ id: 'date' })),
});

export const CreateExchangeRateFormSchema = Schema;
export const EditExchangeRateFormSchema = Schema;
