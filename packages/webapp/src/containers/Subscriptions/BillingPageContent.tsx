import { Intent, Spinner, Text } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useBillingPageBoot } from './BillingPageBoot';
import styles from './BillingPageContent.module.scss';
import { Subscription } from './BillingSubscription';
import { TrialStatus } from './TrialStatus';
import { AppToaster, Box, Group } from '@/components';
import {
  subscriptionKeys,
  useSyncStripeCheckoutSession,
} from '@/hooks/query/subscription';

export function BillingPageContent() {
  const { isLoading, mainSubscription } = useBillingPageBoot();
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

  return (
    <Box className={styles.root}>
      <Text className="bp4-text-muted" style={{ marginTop: '1rem' }}>
        Only pay for what you really need. Go comes with 24/7 customer support.
      </Text>

      {mainSubscription && (
        <Group style={{ marginTop: '2rem' }}>
          <Subscription />
        </Group>
      )}

      <TrialStatus />
    </Box>
  );
}
