import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  transfer_number: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('transfer_number')),
  from_warehouse: Yup.number().required().label(intl.get('from_warehouse')),
  to_warehouse: Yup.number().required().label(intl.get('from_warehouse')),
  reason: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('reason')),
  entries: Yup.array().of(
    Yup.object().shape({
      item_id: Yup.number().nullable(),
      source_warehouse: Yup.number().nullable(),
      destination_warehouse: Yup.number().nullable(),
      quantity: Yup.number().nullable().max(DATATYPES_LENGTH.INT_10),
    }),
  ),
});

export const CreateWarehouseFormSchema = Schema;
export const EditWarehouseFormSchema = Schema;
