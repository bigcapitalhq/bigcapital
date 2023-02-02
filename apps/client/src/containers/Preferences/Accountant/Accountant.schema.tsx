// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  accounting_basis: Yup.string().required(),
  account_code_required: Yup.boolean().nullable(),
  account_code_unique: Yup.boolean().nullable(),
  withdrawal_account: Yup.number().nullable(),
  preferred_deposit_account: Yup.number().nullable(),
  preferred_advance_deposit: Yup.number().nullable(),
});

export const AccountantSchema = Schema;
