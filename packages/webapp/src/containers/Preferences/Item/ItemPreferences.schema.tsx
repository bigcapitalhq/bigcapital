// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  preferred_sell_account: Yup.number().nullable(),
  preferred_cost_account: Yup.number().nullable(),
  preferred_inventory_account: Yup.number().nullable(),
});

export const ItemPreferencesSchema = Schema;
