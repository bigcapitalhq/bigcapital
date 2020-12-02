import * as Yup from 'yup';

const Schema = Yup.object().shape({
  accounting_basis: Yup.string().required(),
  account_code_required: Yup.boolean(),
  customer_deposit_account: Yup.number().nullable(),
  vendor_withdrawal_account: Yup.number().nullable(),
});

export const AccountantSchema = Schema;