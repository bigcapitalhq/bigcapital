import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  journal_number: Yup.string()
    .required()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'journal_number_' })),
  journal_type: Yup.string()
    .required()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'journal_type' })),
  date: Yup.date()
    .required()
    .label(formatMessage({ id: 'date' })),
  currency_code: Yup.string().max(3),
  reference: Yup.string().min(1).max(DATATYPES_LENGTH.STRING),
  description: Yup.string().min(1).max(DATATYPES_LENGTH.STRING),
  entries: Yup.array().of(
    Yup.object().shape({
      credit: Yup.number().decimalScale(13).nullable(),
      debit: Yup.number().decimalScale(13).nullable(),
      account_id: Yup.number()
        .nullable()
        .when(['credit', 'debit'], {
          is: (credit, debit) => credit || debit,
          then: Yup.number().required(),
        }),
      contact_id: Yup.number().nullable(),
      contact_type: Yup.string().nullable(),
      note: Yup.string().max(DATATYPES_LENGTH.TEXT).nullable(),
    }),
  ),
});

export const CreateMakeJournalFormSchema = Schema;
export const EditMakeJournalFormSchema = Schema;
