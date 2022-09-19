// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  transaction_number: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('transaction_number')),
  from_warehouse_id: Yup.number().required().label(intl.get('from_warehouse')),
  to_warehouse_id: Yup.number().required().label(intl.get('from_warehouse')),
  reason: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('reason')),
  transfer_initiated: Yup.boolean(),
  transfer_delivered: Yup.boolean(),
  entries: Yup.array().of(
    Yup.object().shape({
      item_id: Yup.number().nullable(),
      description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
      quantity: Yup.number().min(1).max(DATATYPES_LENGTH.INT_10),
    }),
  ),
});

export const CreateWarehouseFormSchema = Schema;
export const EditWarehouseFormSchema = Schema;
