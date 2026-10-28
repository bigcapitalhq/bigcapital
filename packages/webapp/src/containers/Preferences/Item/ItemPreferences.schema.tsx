import * as Yup from 'yup';

const Schema = Yup.object().shape({
  preferredSellAccount: Yup.number().nullable(),
  preferredCostAccount: Yup.number().nullable(),
  preferredInventoryAccount: Yup.number().nullable(),
  preventStockFromGoingBelowZero: Yup.boolean(),
});

export const ItemPreferencesSchema = Schema;
