// @ts-nocheck
import * as Yup from 'yup';
import moment from 'moment';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const BillFormSchema = Yup.object().shape({
  vendor_id: Yup.number().required().label(intl.get('vendor_name_')),
  bill_date: Yup.date().required().label(intl.get('bill_date_')),
  due_date: Yup.date()
    .min(Yup.ref('bill_date'), ({ path, min }) =>
      intl.get('bill.validation.due_date', {
        path,
        min: moment(min).format('YYYY/MM/DD'),
      }),
    )
    .required()
    .label(intl.get('due_date_')),
  bill_number: Yup.string()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('bill_number_')),
  reference_no: Yup.string().nullable().min(1).max(DATATYPES_LENGTH.STRING),
  note: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('note')),
  open: Yup.boolean(),
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
      total: Yup.number().nullable(),
      discount: Yup.number().nullable().min(0).max(DATATYPES_LENGTH.INT_10),
      description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
    }),
  ),
});

const CreateBillFormSchema = BillFormSchema;
const EditBillFormSchema = BillFormSchema;

export { CreateBillFormSchema, EditBillFormSchema };
