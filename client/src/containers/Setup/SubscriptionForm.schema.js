import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

export const  SubscriptionFormSchema = Yup.object().shape({
  plan_slug: Yup.string()
    .required()
    .label(formatMessage({ id: 'plan_slug' })),
  period: Yup.string().required(),
});