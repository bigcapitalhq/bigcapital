import { Box, Group } from '@/components';
import { Text } from '@blueprintjs/core';
import { Subscription } from './BillingSubscription';
import styles from './BillingPageContent.module.scss';

export function BillingPageContent() {
  return (
    <Box className={styles.root}>
      <Text>
        Transactions locking has the ability to lock all organization
        transactions so users can’t edit, delete or create new transactions
        during the past period.
      </Text>

      <Group style={{ marginTop: '2rem' }}>
        <Subscription />
      </Group>
    </Box>
  );
}
