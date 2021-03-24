import * as Yup from 'yup';

const Schema = Yup.object().shape({
  sell_account: Yup.number().nullable(),
  cost_account: Yup.number().nullable(),
  inventory_account: Yup.number().nullable(),
});

export const ItemPreferencesSchema = Schema;
