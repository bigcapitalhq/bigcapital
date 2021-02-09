import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  currency_name: Yup.string()
    .required()
    .label(formatMessage({ id: 'currency_name_' })),
  currency_code: Yup.string()
    .max(4)
    .required()
    .label(formatMessage({ id: 'currency_code_' })),
});

export const CreateCurrencyFormSchema = Schema;
export const EditCurrencyFormSchema = Schema;
