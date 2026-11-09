import moment from 'moment';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const BillFormSchema = Yup.object().shape({
  vendorId: Yup.number().required().label(intl.get('vendor_name_')),
  billDate: Yup.date().required().label(intl.get('bill_date_')),
  dueDate: Yup.date()
    .min(Yup.ref('billDate'), ({ path, min }) =>
      intl.get('bill.validation.due_date', {
        path,
        min: moment(min).format('YYYY/MM/DD'),
      }),
    )
    .required()
    .label(intl.get('due_date_')),
  billNumber: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('bill_number_')),
  referenceNo: Yup.string().nullable().min(1).max(DATATYPES_LENGTH.STRING),
  note: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('note')),
  open: Yup.boolean(),
  branchId: Yup.string(),
  warehouseId: Yup.string(),
  exchangeRate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .nullable()
        .max(DATATYPES_LENGTH.INT_10)
        .when(['rate'], {
          is: (rate: unknown) => rate,
          then: Yup.number().required(),
        }),
      rate: Yup.number().nullable().max(DATATYPES_LENGTH.INT_10),
      itemId: Yup.number()
        .nullable()
        .when(['quantity', 'rate'], {
          is: (quantity: unknown, rate: unknown) =>
            !isBlank(quantity) && !isBlank(rate),
          then: Yup.number().required(),
        }),
      total: Yup.number().nullable(),
      discount: Yup.number().nullable().min(0).max(DATATYPES_LENGTH.INT_10),
      description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
    }),
  ),
});

const CreateBillFormSchema = BillFormSchema;
const EditBillFormSchema = BillFormSchema;

export { CreateBillFormSchema, EditBillFormSchema };
