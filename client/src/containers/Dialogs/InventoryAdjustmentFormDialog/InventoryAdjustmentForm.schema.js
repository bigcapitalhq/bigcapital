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
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(formatMessage({ id: 'reason' })),
  quantity_on_hand: Yup.number()
    .required()
    .label(formatMessage({ id: 'qty' })),
  quantity: Yup.number().integer().min(1).required(),
  cost: Yup.number().when(['type'], {
    is: (type) => type === 'increment',
    then: Yup.number().required(),
  }),
  reference_no: Yup.string(),
  new_quantity: Yup.number().required(),
  publish: Yup.boolean(),
});

export const CreateInventoryAdjustmentFormSchema = Schema;
