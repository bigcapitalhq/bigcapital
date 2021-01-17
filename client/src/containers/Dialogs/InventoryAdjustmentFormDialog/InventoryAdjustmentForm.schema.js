import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date()
    .required()
    .label(formatMessage({ id: 'date' })),
  type: Yup.string().required(),
  adjustment_account_id: Yup.string().required(),
  item_id: Yup.number().required(),
  reason: Yup.string()
    .required()
    .label(formatMessage({ id: 'reason' })),
  quantity_on_hand: Yup.number()
    .min(0)
    .required()
    .label(formatMessage({ id: 'qty' })),
  quantity: Yup.number().integer().max(Yup.ref('quantity_on_hand')).required(),
  cost: Yup.number().when(['type'], {
    is: (type) => type,
    then: Yup.number(),
  }),
  reference_no: Yup.string(),
  new_quantity: Yup.number().min(Yup.ref('quantity')).required(),
  description: Yup.string().min(3).max(DATATYPES_LENGTH.TEXT).nullable().trim(),
  publish: Yup.boolean(),
});

export const CreateInventoryAdjustmentFormSchema = Schema;
