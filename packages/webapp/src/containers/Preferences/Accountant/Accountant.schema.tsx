// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  organization: Yup.object({
    accountingBasis: Yup.string().required(),
  }),
  accounts: Yup.object({
    accountCodeRequired: Yup.boolean().nullable(),
    accountCodeUnique: Yup.boolean().nullable(),
  }),
  paymentReceives: Yup.object({
    preferredDepositAccount: Yup.number().nullable(),
    preferredAdvanceDeposit: Yup.number().nullable(),
    withdrawalAccount: Yup.number().nullable(),
  })
});

export const AccountantSchema = Schema;
