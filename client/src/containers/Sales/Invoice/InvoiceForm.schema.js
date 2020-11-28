import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';
import { isBlank } from 'utils';

const Schema = Yup.object().shape({
  customer_id: Yup.string()
    .label(formatMessage({ id: 'customer_name_' }))
    .required(),
  invoice_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'invoice_date_' })),
  due_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'due_date_' })),
  invoice_no: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'invoice_no_' })),
  reference_no: Yup.string().min(1).max(DATATYPES_LENGTH.STRING),
  status: Yup.string().required(),
  invoice_message: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(formatMessage({ id: 'note' })),
  terms_conditions: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(formatMessage({ id: 'note' })),
  entries: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .nullable().max(DATATYPES_LENGTH.INT_10)
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
      discount: Yup.number().nullable().min(0).max(DATATYPES_LENGTH.INT_10),
      description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
    }),
  ),
});

export const CreateInvoiceFormSchema = Schema;
export const EditInvoiceFormSchema = Schema;
