import * as Yup from 'yup';

const Schema = Yup.object().shape({
  openingBalanceBranchId: Yup.string(),
  openingBalance: Yup.number().nullable(),
  openingBalanceAt: Yup.date(),
  openingBalanceExchangeRate: Yup.number(),
});

export const CreateVendorOpeningBalanceFormSchema = Schema;
