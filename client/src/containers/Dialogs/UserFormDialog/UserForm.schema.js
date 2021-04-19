import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

const Schema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label(formatMessage({ id: 'email' })),
  first_name: Yup.string()
    .required()
    .label(formatMessage({ id: 'first_name_' })),
  last_name: Yup.string()
    .required()
    .label(formatMessage({ id: 'last_name_' })),
  phone_number: Yup.string()
    .matches()
    .required()
    .label(formatMessage({ id: 'phone_number_' })),
});

export const UserFormSchema = Schema;
