import intl from 'react-intl-universal';
import * as Yup from 'yup';

export const getSubscriptionFormSchema = () =>
  Yup.object().shape({
    plan_slug: Yup.string().required().label(intl.get('plan_slug')),
    period: Yup.string().required(),
  });
