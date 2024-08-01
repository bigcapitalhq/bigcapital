// @ts-nocheck
import { Box, Group } from '@/components';
import { Spinner, Text } from '@blueprintjs/core';
import { Subscription } from './BillingSubscription';
import { useBillingPageBoot } from './BillingPageBoot';
import styles from './BillingPageContent.module.scss';

export function BillingPageContent() {
  const { isSubscriptionsLoading, subscriptions } = useBillingPageBoot();

  if (isSubscriptionsLoading || !subscriptions) {
    return <Spinner size={30} />;
  }

  return (
    <Box className={styles.root}>
      <Text>
        Only pay for what you really need. All plans come with 24/7 customer support.
      </Text>

      <Group style={{ marginTop: '2rem' }}>
        <Subscription />
      </Group>
    </Box>
  );
}
