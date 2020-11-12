import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

const Schema =  Yup.object().shape({
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
    .required()
    .nullable()
    .label(formatMessage({ id: 'estimate_number_' })),
  reference: Yup.string().min(1).max(255),
  note: Yup.string()
    .trim()
    .min(1)
    .max(1024)
    .label(formatMessage({ id: 'note' })),
  terms_conditions: Yup.string()
    .trim()
    .min(1)
    .max(1024)
    .label(formatMessage({ id: 'note' })),
  entries: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .nullable()
        .when(['rate'], {
          is: (rate) => rate,
          then: Yup.number().required(),
        }),
      rate: Yup.number().nullable(),
      item_id: Yup.number()
        .nullable()
        .when(['quantity', 'rate'], {
          is: (quantity, rate) => quantity || rate,
          then: Yup.number().required(),
        }),
      discount: Yup.number().nullable().min(0).max(100),
      description: Yup.string().nullable(),
    }),
  ),
});

export const CreateEstimateFormSchema = Schema;
export const EditEstimateFormSchema = Schema;