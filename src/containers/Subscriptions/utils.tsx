// @ts-nocheck
import * as Yup from 'yup';

export const getBillingFormValidationSchema = () =>
  Yup.object().shape({
    plan_slug: Yup.string().required(),
    period: Yup.string().required(),
    license_code: Yup.string().trim(),
  });
