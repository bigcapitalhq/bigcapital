import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  vendorId: Yup.string().label(intl.get('vendor_name_')).required(),
  paymentDate: Yup.date().required().label(intl.get('payment_date_')),
  paymentAccountId: Yup.number().required().label(intl.get('payment_account_')),
  paymentNumber: Yup.string()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .nullable()
    .label(intl.get('payment_no_')),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  description: Yup.string().max(DATATYPES_LENGTH.TEXT),
  branchId: Yup.string(),
  exchangeRate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(),
      dueAmount: Yup.number().nullable(),
      paymentAmount: Yup.number().nullable().max(Yup.ref('dueAmount')),
      billId: Yup.number()
        .nullable()
        .when(['paymentAmount'], {
          is: (paymentAmount: unknown) => !!paymentAmount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreatePaymentMadeFormSchema = Schema;
export const EditPaymentMadeFormSchema = Schema;
