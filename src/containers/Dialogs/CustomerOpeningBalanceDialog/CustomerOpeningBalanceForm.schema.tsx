// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  opening_balance_branch_id: Yup.string(),
  opening_balance: Yup.number().nullable(),
  opening_balance_at: Yup.date(),
  opening_balance_exchange_rate: Yup.number(),
});

export const CreateCustomerOpeningBalanceFormSchema = Schema;
