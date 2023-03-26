// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const getSchema = () =>
  Yup.object().shape({
    customer_id: Yup.string().label(intl.get('customer_name_')).required(),
    credit_note_date: Yup.date().required().label(intl.get('invoice_date_')),
    credit_note_number: Yup.string()
      .max(DATATYPES_LENGTH.STRING)
      .label(intl.get('invoice_no_')),
    reference_no: Yup.string().min(1).max(DATATYPES_LENGTH.STRING),
    note: Yup.string()
      .trim()
      .min(1)
      .max(DATATYPES_LENGTH.TEXT)
      .label(intl.get('note')),
    open: Yup.boolean(),
    terms_conditions: Yup.string()
      .trim()
      .min(1)
      .max(DATATYPES_LENGTH.TEXT)
      .label(intl.get('note')),
    branch_id: Yup.string(),
    warehouse_id: Yup.string(),
    exchange_rate:Yup.number(),
    entries: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number()
          .nullable()
          .max(DATATYPES_LENGTH.INT_10)
          .when(['rate'], {
            is: (rate) => rate,
            then: Yup.number().required(),
          }),
        rate: Yup.number().nullable().max(DATATYPES_LENGTH.INT_10),
        item_id: Yup.number()
          .nullable()
          .when(['quantity', 'rate'], {
            is: (quantity, rate) => !isBlank(quantity) && !isBlank(rate),
            then: Yup.number().required(),
          }),
        discount: Yup.number().nullable().min(0).max(100),
        description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
      }),
    ),
  });

export const CreateCreditNoteFormSchema = getSchema;
export const EditCreditNoteFormSchema = getSchema;
