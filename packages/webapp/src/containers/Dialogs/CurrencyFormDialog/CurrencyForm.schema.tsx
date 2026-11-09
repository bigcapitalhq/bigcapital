import intl from 'react-intl-universal';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  currencyName: Yup.string().required().label(intl.get('currency_name_')),
  currencyCode: Yup.string()
    .max(4)
    .required()
    .label(intl.get('currency_code_')),
  currencySign: Yup.string().required(),
});

export const CreateCurrencyFormSchema = Schema;
export const EditCurrencyFormSchema = Schema;
