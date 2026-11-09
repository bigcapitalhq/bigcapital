import * as Yup from 'yup';

const Schema = Yup.object().shape({
  entries: Yup.array().of(
    Yup.object().shape({
      billId: Yup.number().required(),
      amount: Yup.number().nullable(),
    }),
  ),
});

export const CreateReconcileVendorCreditFormSchema = Schema;
