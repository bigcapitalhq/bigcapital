// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import moment from 'moment';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const Schema = Yup.object().shape({
  customer_id: Yup.number().label(intl.get('customer_name_')).required(),
  estimate_date: Yup.date().required().label(intl.get('estimate_date_')),
  expiration_date: Yup.date()
    .required()
    .min(Yup.ref('estimate_date'), ({ path, min }) =>
      intl.get('estimate.validation.expiration_date', {
        path,
        min: moment(min).format('YYYY/MM/DD'),
      }),
    )
    .label(intl.get('expiration_date_')),
  estimate_number: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('estimate_number_')),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  note: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('note')),
  terms_conditions: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('note')),
  delivered: Yup.boolean(),
  branch_id: Yup.string(),
  warehouse_id: Yup.string(),
  exchange_rate: Yup.number(),
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

export const CreateEstimateFormSchema = Schema;
export const EditEstimateFormSchema = Schema;
