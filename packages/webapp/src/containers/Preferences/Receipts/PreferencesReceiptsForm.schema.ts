import * as Yup from 'yup';

// Note: `customerNotes` is declared in the schema but unused by the form
// (the form uses `receiptMessage`). Preserved as-is during TS conversion.
const Schema = Yup.object().shape({
  termsConditions: Yup.string().optional(),
  customerNotes: Yup.string().optional(),
  receiptMessage: Yup.string().optional(),
});

export const PreferencesReceiptsFormSchema = Schema;
