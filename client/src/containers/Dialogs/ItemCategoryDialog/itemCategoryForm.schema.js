import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  name: Yup.string()
    .required()
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'category_name_' })),
  cost_account_id: Yup.number().nullable(),
  sell_account_id: Yup.number().nullable(),
  inventory_account_id: Yup.number().nullable(),
  description: Yup.string().trim().max(DATATYPES_LENGTH.TEXT).nullable(),
});

export const CreateItemCategoryFormSchema = Schema;
export const EditItemCategoryFormSchema = Schema;
