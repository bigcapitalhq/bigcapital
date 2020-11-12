import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

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
  invoice_no: Yup.string().label(formatMessage({ id: 'invoice_no_' })),
  reference_no: Yup.string().min(1).max(255),
  status: Yup.string().required(),
  invoice_message: Yup.string()
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

export const CreateInvoiceFormSchema = Schema;
export const EditInvoiceFormSchema = Schema;