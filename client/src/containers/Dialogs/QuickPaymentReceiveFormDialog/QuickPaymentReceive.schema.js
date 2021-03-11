import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  customer_id: Yup.string()
    .label(formatMessage({ id: 'customer_name_' }))
    .required(),
  payment_receive_no: Yup.string()
    .required()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'payment_receive_no_' })),
  payment_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'payment_date_' })),
  deposit_account_id: Yup.number()
    .required()
    .label(formatMessage({ id: 'deposit_account_' })),
  reference_no: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  // statement: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  entries: Yup.array().of(
    Yup.object().shape({
      payment_amount: Yup.number().nullable(),
      invoice_id: Yup.number()
        .nullable()
        .when(['payment_amount'], {
          is: (payment_amount) => payment_amount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreateQuickPaymentReceiveFormSchema = Schema;
