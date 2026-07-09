import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  type: Yup.string().required(),
  adjustmentAccountId: Yup.string()
    .required()
    .label(intl.get('adjustment_account')),
  itemId: Yup.number().required(),
  reason: Yup.string()
    .required()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('reason')),
  quantityOnHand: Yup.number().required().label(intl.get('qty')),
  quantity: Yup.number().integer().min(1).required(),
  cost: Yup.number().when(['type'], {
    is: (type: string) => type === 'increment',
    then: Yup.number().required(),
  }),
  referenceNo: Yup.string(),
  newQuantity: Yup.number().required(),
  publish: Yup.boolean(),
  branchId: Yup.string(),
  warehouseId: Yup.string(),
});

export const CreateInventoryAdjustmentFormSchema = Schema;
