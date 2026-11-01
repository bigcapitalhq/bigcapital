import moment from 'moment';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const Schema = Yup.object().shape({
  customerId: Yup.number().label(intl.get('customer_name_')).required(),
  estimateDate: Yup.date().required().label(intl.get('estimate_date_')),
  expirationDate: Yup.date()
    .required()
    .min(Yup.ref('estimateDate'), ({ path, min }) =>
      intl.get('estimate.validation.expiration_date', {
        path,
        min: moment(min).format('YYYY/MM/DD'),
      }),
    )
    .label(intl.get('expiration_date_')),
  estimateNumber: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('estimate_number_')),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  note: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('note')),
  termsConditions: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('note')),
  delivered: Yup.boolean(),
  branchId: Yup.string(),
  warehouseId: Yup.string(),
  exchangeRate: Yup.number(),
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
      itemId: Yup.number()
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
