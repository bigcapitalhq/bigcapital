import * as Yup from 'yup';
import { ITEM_COST_METHODS } from '@/constants/costMethods';

const reorderPointNotificationEmailSchema = Yup.string()
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .email();

const Schema = Yup.object().shape({
  preferredSellAccount: Yup.number().nullable(),
  preferredCostAccount: Yup.number().nullable(),
  preferredInventoryAccount: Yup.number().nullable(),
  defaultCostMethod: Yup.string()
    .oneOf([...ITEM_COST_METHODS])
    .required(),
  reorderPointNotifications: Yup.boolean(),
  reorderPointNotificationEmail: reorderPointNotificationEmailSchema.when(
    'reorderPointNotifications',
    {
      is: true,
      then: reorderPointNotificationEmailSchema.required(),
      otherwise: reorderPointNotificationEmailSchema,
    },
  ),
  preventStockFromGoingBelowZero: Yup.boolean(),
});

export const ItemPreferencesSchema = Schema;
