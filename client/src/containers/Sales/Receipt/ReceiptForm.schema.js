import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

const Schema = Yup.object().shape({
  customer_id: Yup.string()
    .label(formatMessage({ id: 'customer_name_' }))
    .required(),
  receipt_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'receipt_date_' })),
  receipt_number: Yup.string()
    .label(formatMessage({ id: 'receipt_no_' })),
  deposit_account_id: Yup.number()
    .required()
    .label(formatMessage({ id: 'deposit_account_' })),
  reference_no: Yup.string().min(1).max(255),
  receipt_message: Yup.string()
    .trim()
    .min(1)
    .max(1024)
    .label(formatMessage({ id: 'receipt_message_' })),
  statement: Yup.string()
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

const CreateReceiptFormSchema = Schema;
const EditReceiptFormSchema = Schema;

export {
  CreateReceiptFormSchema,
  EditReceiptFormSchema
};