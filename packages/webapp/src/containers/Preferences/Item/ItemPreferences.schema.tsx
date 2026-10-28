import * as Yup from 'yup';

const reorderPointNotificationEmailSchema = Yup.string()
  .transform((value) => (value === '' ? null : value))
  .nullable()
  .email();

const Schema = Yup.object().shape({
  preferredSellAccount: Yup.number().nullable(),
  preferredCostAccount: Yup.number().nullable(),
  preferredInventoryAccount: Yup.number().nullable(),
  reorderPointNotifications: Yup.boolean(),
  reorderPointNotificationEmail: reorderPointNotificationEmailSchema.when(
    'reorderPointNotifications',
    {
      is: true,
      then: reorderPointNotificationEmailSchema.required(),
      otherwise: reorderPointNotificationEmailSchema,
    },
  ),
});

export const ItemPreferencesSchema = Schema;
