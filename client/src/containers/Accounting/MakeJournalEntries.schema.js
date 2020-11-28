import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

const Schema = Yup.object().shape({
  journal_number: Yup.string()
    .required()
    .min(1)
    .max(255)
    .label(formatMessage({ id: 'journal_number_' })),
  journal_type: Yup.string()
    .required()
    .min(1)
    .max(255)
    .label(formatMessage({ id: 'journal_type' })),
  date: Yup.date()
    .required()
    .label(formatMessage({ id: 'date' })),
  currency_code: Yup.string(),
  reference: Yup.string().min(1).max(255),
  description: Yup.string().min(1).max(1024),
  entries: Yup.array().of(
    Yup.object().shape({
      credit: Yup.number().nullable(),
      debit: Yup.number().nullable(),
      account_id: Yup.number()
        .nullable()
        .when(['credit', 'debit'], {
          is: (credit, debit) => credit || debit,
          then: Yup.number().required(),
        }),
      contact_id: Yup.number().nullable(),
      contact_type: Yup.string().nullable(),
      note: Yup.string().max(255).nullable(),
    }),
  ),
});

export const CreateJournalSchema = Schema;
export const EditJournalSchema = Schema;