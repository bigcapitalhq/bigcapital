import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date()
    .required()
    .label(formatMessage({ id: 'date' })),
  type: Yup.number().required(),
  adjustment_account_id: Yup.number().required(),
  reason: Yup.string()
    .required()
    .label(formatMessage({ id: 'reason' })),
  quantity: Yup.number().when(['type'], {
    is: (type) => type,
    then: Yup.number().required(),
  }),
  cost: Yup.number().when(['type'], {
    is: (type) => type,
    then: Yup.number().required(),
  }),
  reference_no: Yup.string(),
  new_quantity: Yup.number(),
  description: Yup.string().min(3).max(DATATYPES_LENGTH.TEXT).nullable().trim(),
});

export const CreateInventoryAdjustmentFormSchema = Schema;
