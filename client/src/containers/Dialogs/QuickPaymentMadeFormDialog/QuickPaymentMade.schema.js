import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  vendor_id: Yup.string()
    .label(formatMessage({ id: 'vendor_name_' }))
    .required(),
  payment_date: Yup.date()
    .required()
    .label(formatMessage({ id: 'payment_date_' })),
  payment_number: Yup.string()
    .nullable()
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'payment_no_' })),
  payment_account_id: Yup.number()
    .required()
    .label(formatMessage({ id: 'payment_account_' })),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  // statement: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  entries: Yup.array().of(
    Yup.object().shape({
      payment_amount: Yup.number().nullable(),
      bill_id: Yup.number()
        .nullable()
        .when(['payment_amount'], {
          is: (payment_amount) => payment_amount,
          then: Yup.number().required(),
        }),
    }),
  ),
});

export const CreateQuickPaymentMadeFormSchema = Schema;
