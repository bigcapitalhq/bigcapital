import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  customerId: Yup.string().label(intl.get('customer_name_')).required(),
  paymentDate: Yup.date().required().label(intl.get('payment_date_')),
  depositAccountId: Yup.number().required().label(intl.get('deposit_account_')),
  amount: Yup.number().required().label('Amount'),
  paymentReceiveNo: Yup.string()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('payment_received_no_')),
  referenceNo: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  // statement: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  branchId: Yup.string(),
  exchangeRate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(),
      dueAmount: Yup.number().nullable(),
      paymentAmount: Yup.number().nullable().max(Yup.ref('dueAmount')),
      invoiceId: Yup.number()
        .nullable()
        .when(['paymentAmount'], {
          is: (paymentAmount: unknown) => !!paymentAmount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreatePaymentReceiveFormSchema = Schema;
export const EditPaymentReceiveFormSchema = Schema;
