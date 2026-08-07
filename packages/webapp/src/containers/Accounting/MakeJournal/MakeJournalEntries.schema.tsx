import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  journalNumber: Yup.string()
    .required()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('journal_number_')),
  journalType: Yup.string()
    .required()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('journal_type')),
  date: Yup.date().required().label(intl.get('date')),
  currencyCode: Yup.string().max(3),
  publish: Yup.boolean(),
  branchId: Yup.string(),
  reference: Yup.string().nullable().min(1).max(DATATYPES_LENGTH.STRING),
  description: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  exchangeRate: Yup.number(),
  entries: Yup.array().of(
    Yup.object().shape({
      credit: Yup.number().nullable(),
      debit: Yup.number().nullable(),
      accountId: Yup.number()
        .nullable()
        .when(['credit', 'debit'], {
          is: (credit, debit) => credit || debit,
          then: Yup.number().required(),
        }),
      contactId: Yup.number().nullable(),
      contactType: Yup.string().nullable(),
      projectId: Yup.number().nullable(),
      note: Yup.string().max(DATATYPES_LENGTH.TEXT).nullable(),
    }),
  ),
});

export const CreateJournalSchema = Schema;
export const EditJournalSchema = Schema;
