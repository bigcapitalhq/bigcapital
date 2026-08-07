import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  vendorId: Yup.string().label(intl.get('vendor_name_')).required(),
  paymentDate: Yup.date().required().label(intl.get('payment_date_')),
  paymentNumber: Yup.string()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('payment_no_')),
  paymentAccountId: Yup.number().required().label(intl.get('payment_account_')),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  // statement: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  branchId: Yup.string(),
  exchangeRate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      paymentAmount: Yup.number().nullable(),
      billId: Yup.number()
        .nullable()
        .when(['paymentAmount'], {
          is: (paymentAmount) => paymentAmount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreateQuickPaymentMadeFormSchema = Schema;
