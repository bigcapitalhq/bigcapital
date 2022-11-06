// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  entries: Yup.array().of(
    Yup.object().shape({
      invoice_id: Yup.number().required(),
      amount: Yup.number().nullable(),
    }),
  ),
});

export const CreateReconcileCreditNoteFormSchema = Schema;
