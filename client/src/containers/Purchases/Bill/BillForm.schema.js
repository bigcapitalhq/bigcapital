import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

const BillFormSchema = Yup.object().shape({
  vendor_id: Yup.number()
    .required()
    .label(formatMessage({ id: 'vendor_name_' })),
  bill_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'bill_date_' })),
  due_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'due_date_' })),
  bill_number: Yup.string()
    .label(formatMessage({ id: 'bill_number_' })),
  reference_no: Yup.string().nullable().min(1).max(255),
  note: Yup.string()
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
      total: Yup.number().nullable(),
      discount: Yup.number().nullable().min(0).max(100),
      description: Yup.string().nullable(),
    }),
  ),
});

const CreateBillFormSchema = BillFormSchema;
const EditBillFormSchema = BillFormSchema;

export {
  CreateBillFormSchema,
  EditBillFormSchema,
};
