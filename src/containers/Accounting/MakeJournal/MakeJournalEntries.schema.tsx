// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  journal_number: Yup.string()
    .required()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('journal_number_')),
  journal_type: Yup.string()
    .required()
    .min(1)
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('journal_type')),
  date: Yup.date().required().label(intl.get('date')),
  currency_code: Yup.string().max(3),
  publish: Yup.boolean(),
  branch_id: Yup.string(),
  reference: Yup.string().nullable().min(1).max(DATATYPES_LENGTH.STRING),
  description: Yup.string().min(1).max(DATATYPES_LENGTH.STRING).nullable(),
  exchange_rate: Yup.number(),
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
      project_id: Yup.number().nullable(),
      note: Yup.string().max(DATATYPES_LENGTH.TEXT).nullable(),
    }),
  ),
});

export const CreateJournalSchema = Schema;
export const EditJournalSchema = Schema;
