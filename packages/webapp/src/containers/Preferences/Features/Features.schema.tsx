import * as Yup from 'yup';

const Schema = Yup.object().shape({
  features: Yup.object({
    landedCost: Yup.boolean().nullable(),
    smsNotifications: Yup.boolean().nullable(),
  }),
});

export const FeaturesSchema = Schema;
