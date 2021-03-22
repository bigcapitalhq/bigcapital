import * as Yup from 'yup';

const Schema = Yup.object().shape({
  sell_account: Yup.number().nullable().required(),
  cost_account: Yup.number().nullable().required(),
  inventory_account: Yup.number().nullable().required(),
});

export const ItemPreferencesSchema = Schema;
