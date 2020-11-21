import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  name: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'account_name_' })),
  code: Yup.string().digits().min(3).max(6),
  account_type_id: Yup.number()
    .nullable()
    .required()
    .label(formatMessage({ id: 'account_type_id' })),
  description: Yup.string().min(3).max(DATATYPES_LENGTH.TEXT).nullable().trim(),
  parent_account_id: Yup.number().nullable(),
});

export const CreateAccountFormSchema = Schema;
export const EditAccountFormSchema = Schema;
