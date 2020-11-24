import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  customer_id: Yup.number()
    .label(formatMessage({ id: 'customer_name_' }))
    .required(),
  estimate_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'estimate_date_' })),
  expiration_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'expiration_date_' })),
  estimate_number: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'estimate_number_' })),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  note: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'note' })),
  terms_conditions: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(formatMessage({ id: 'note' })),
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
          is: (quantity, rate) => quantity || rate,
          then: Yup.number().required(),
        }),
      discount: Yup.number().nullable().min(0).max(DATATYPES_LENGTH.INT_10),
      description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
    }),
  ),
});

export const CreateEstimateFormSchema = Schema;
export const EditEstimateFormSchema = Schema;
