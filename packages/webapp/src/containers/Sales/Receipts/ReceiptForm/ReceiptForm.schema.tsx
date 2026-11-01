import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const Schema = Yup.object().shape({
  customerId: Yup.string().label(intl.get('customer_name_')).required(),
  receiptDate: Yup.date().required().label(intl.get('receipt_date_')),
  receiptNumber: Yup.string()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('receipt_no_')),
  depositAccountId: Yup.number().required().label(intl.get('deposit_account_')),
  referenceNo: Yup.string().min(1).max(DATATYPES_LENGTH.STRING),
  receiptMessage: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('receipt_message_')),
  statement: Yup.string()
    .trim()
    .min(1)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('note')),
  closed: Yup.boolean(),
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
      discount: Yup.number().nullable().min(0).max(DATATYPES_LENGTH.INT_10),
      description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
    }),
  ),
});

const CreateReceiptFormSchema = Schema;
const EditReceiptFormSchema = Schema;

export { CreateReceiptFormSchema, EditReceiptFormSchema };
