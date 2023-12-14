// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  termsConditions: Yup.string().optional(),
  customerNotes: Yup.string().optional(),
});

export const PreferencesReceiptsFormSchema = Schema;
