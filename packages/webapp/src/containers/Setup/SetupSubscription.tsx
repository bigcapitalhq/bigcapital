// @ts-nocheck
import React from 'react';
import { Formik } from 'formik';
import * as R from 'ramda';

import '@/style/pages/Setup/Subscription.scss';

import SetupSubscriptionForm from './SetupSubscription/SetupSubscriptionForm';
import { getSubscriptionFormSchema } from './SubscriptionForm.schema';
import withSubscriptionPlansActions from '../Subscriptions/withSubscriptionPlansActions';
import { useGetLemonSqueezyCheckout } from '@/hooks/query/subscriptions';

/**
 * Subscription step of wizard setup.
 */
function SetupSubscription({
  // #withSubscriptionPlansActions
  initSubscriptionPlans,
}) {
  React.useEffect(() => {
    initSubscriptionPlans();
  }, [initSubscriptionPlans]);

  React.useEffect(() => {
    window.LemonSqueezy.Setup({
      eventHandler: (event) => {
        // Do whatever you want with this event data
        if (event.event === 'Checkout.Success') {
        }
      },
    });
  }, []);

  // Initial values.
  const initialValues = {
    plan_slug: 'essentials',
    period: 'month',
    license_code: '',
  };
  const { mutateAsync: getLemonCheckout } = useGetLemonSqueezyCheckout();

  // Handle form submit.
  const handleSubmit = (values) => {
    getLemonCheckout({ variantId: '337977' })
      .then((res) => {
        const checkoutUrl = res.data.data.attributes.url;
        window.LemonSqueezy.Url.Open(checkoutUrl);
      })
      .catch(() => {});
  };

  // Retrieve momerized subscription form schema.
  const SubscriptionFormSchema = React.useMemo(
    () => getSubscriptionFormSchema(),
    [],
  );

  return (
    <div className={'setup-subscription-form'}>
      <Formik
        validationSchema={SubscriptionFormSchema}
        initialValues={initialValues}
        component={SetupSubscriptionForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default R.compose(withSubscriptionPlansActions)(SetupSubscription);
