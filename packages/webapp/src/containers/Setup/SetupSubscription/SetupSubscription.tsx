import * as R from 'ramda';
import { useEffect } from 'react';
import {
  withSubscriptionPlansActions,
  WithSubscriptionPlansActionsProps,
} from '../../Subscriptions/withSubscriptionPlansActions';
import styles from './SetupSubscription.module.scss';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { Box } from '@/components';

/**
 * Subscription step of wizard setup.
 */
function SetupSubscriptionInner({
  initSubscriptionPlans,
}: WithSubscriptionPlansActionsProps) {
  useEffect(() => {
    initSubscriptionPlans();
  }, [initSubscriptionPlans]);

  useEffect(() => {
    window.LemonSqueezy?.Setup({
      eventHandler: (event) => {
        // Do whatever you want with this event data
        if (event.event === 'Checkout.Success') {
        }
      },
    });
  }, []);

  return (
    <Box className={styles.root}>
      <SubscriptionPlansSection />
    </Box>
  );
}

export const SetupSubscription = R.compose(withSubscriptionPlansActions)(
  SetupSubscriptionInner,
);
