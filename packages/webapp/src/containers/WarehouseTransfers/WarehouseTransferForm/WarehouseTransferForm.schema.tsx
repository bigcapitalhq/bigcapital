import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  transactionNumber: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('transaction_number')),
  fromWarehouseId: Yup.number().required().label(intl.get('from_warehouse')),
  toWarehouseId: Yup.number().required().label(intl.get('from_warehouse')),
  reason: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('reason')),
  transferInitiated: Yup.boolean(),
  transferDelivered: Yup.boolean(),
  entries: Yup.array().of(
    Yup.object().shape({
      itemId: Yup.number().nullable(),
      description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
      quantity: Yup.number().min(1).max(DATATYPES_LENGTH.INT_10),
    }),
  ),
});

export const CreateWarehouseFormSchema = Schema;
export const EditWarehouseFormSchema = Schema;
