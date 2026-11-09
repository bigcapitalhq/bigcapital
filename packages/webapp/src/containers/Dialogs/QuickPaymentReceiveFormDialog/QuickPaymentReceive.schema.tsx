import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  customerId: Yup.string().label(intl.get('customer_name_')).required(),
  paymentReceiveNo: Yup.string()
    .required()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('payment_received_no_')),
  paymentDate: Yup.date().required().label(intl.get('payment_date_')),
  depositAccountId: Yup.number().required().label(intl.get('deposit_account_')),
  referenceNo: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  // statement: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  branchId: Yup.string(),
  exchangeRate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      paymentAmount: Yup.number().nullable(),
      invoiceId: Yup.number()
        .nullable()
        .when(['paymentAmount'], {
          is: (paymentAmount) => paymentAmount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreateQuickPaymentReceiveFormSchema = Schema;
