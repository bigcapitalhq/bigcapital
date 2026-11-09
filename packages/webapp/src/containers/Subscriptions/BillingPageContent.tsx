import { Intent, Spinner, Text } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BillingInvoices } from './BillingInvoices';
import { useBillingPageBoot } from './BillingPageBoot';
import styles from './BillingPageContent.module.scss';
import { BillingPaymentMethod } from './BillingPaymentMethod';
import { BillingPlansSection } from './BillingPlansSection';
import { Subscription } from './BillingSubscription';
import { AppToaster, Box, Can, Group } from '@/components';
import {
  subscriptionKeys,
  useSyncStripeCheckoutSession,
} from '@/hooks/query/subscription';

export function BillingPageContent() {
  const { isLoading, mainSubscription, billingOverview } = useBillingPageBoot();
  const location = useLocation();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { mutateAsync: syncCheckoutSession } = useSyncStripeCheckoutSession();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const checkout = params.get('checkout');
    if (!checkout) return;

    // Remove the Stripe return parameters so a refresh does not replay them.
    history.replace({ pathname: location.pathname });

    if (checkout === 'cancel') {
      AppToaster.show({
        message: 'Checkout was canceled.',
        intent: Intent.NONE,
      });
      return;
    }

    if (checkout === 'success') {
      const sessionId = params.get('session_id');
      const syncPromise = sessionId
        ? syncCheckoutSession({ sessionId })
        : Promise.resolve();

      syncPromise
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: subscriptionKeys.all(),
          });
          AppToaster.show({
            message: 'The subscription has been activated.',
            intent: Intent.SUCCESS,
          });
        })
        .catch(() => {
          AppToaster.show({
            message:
              'Your subscription is still processing. Please refresh in a moment.',
            intent: Intent.WARNING,
          });
        });
    }
  }, [
    location.search,
    location.pathname,
    history,
    queryClient,
    syncCheckoutSession,
  ]);

  if (isLoading) {
    return <Spinner size={30} />;
  }

  const hasStripeAccount = !!billingOverview?.customer;
  const hasActiveSubscription =
    !!mainSubscription?.active &&
    (!!mainSubscription.stripeStatus ||
      Number(mainSubscription.planPrice || 0) > 0);

  return (
    <Box className={styles.root}>
      <Text>
        Only pay for what you really need. All plans come with 24/7 customer
        support.
      </Text>

      {mainSubscription && (
        <Group style={{ marginTop: '2rem' }}>
          <Subscription />
        </Group>
      )}

      {hasStripeAccount && <BillingPaymentMethod />}
      {hasStripeAccount && <BillingInvoices />}

      {!hasActiveSubscription && (
        <Can I="manage" a="all">
          <BillingPlansSection />
        </Can>
      )}
    </Box>
  );
}
