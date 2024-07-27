// @ts-nocheck
import * as R from 'ramda';
import { Box, Group, Stack } from '@/components';
import { Button, Card, Intent, Text } from '@blueprintjs/core';
import withAlertActions from '../Alert/withAlertActions';
import styles from './BillingSubscription.module.scss';

function SubscriptionRoot({ openAlert }) {
  const handleCancelSubBtnClick = () => {
    openAlert('cancel-main-subscription');
  };
  const handleResumeSubBtnClick = () => {
    openAlert('resume-main-subscription');
  };
  const handleUpdatePaymentMethod = () => {};

  const handleUpgradeBtnClick = () => {};

  return (
    <Card className={styles.root}>
      <Stack spacing={8}>
        <h1 className={styles.title}>Capital Essential</h1>

        <Group spacing={0} className={styles.period}>
          <Text className={styles.periodStatus}>Trial</Text>
          <Text className={styles.periodText}>Trial ends in 10 days.</Text>
        </Group>
      </Stack>

      <Text className={styles.description}>
        Transactions locking has the ability to lock all organization
        transactions so users can’t edit, delete or create new transactions
        during the past period.
      </Text>

      <Stack align="flex-start" spacing={8} className={styles.actions}>
        <Button
          minimal
          small
          inline
          intent={Intent.PRIMARY}
          onClick={handleUpgradeBtnClick}
        >
          Upgrade the Plan
        </Button>
        <Button
          minimal
          small
          inline
          intent={Intent.PRIMARY}
          onClick={handleCancelSubBtnClick}
        >
          Cancel Subscription
        </Button>
        <Button
          minimal
          small
          inline
          intent={Intent.PRIMARY}
          onClick={handleUpdatePaymentMethod}
        >
          Change Payment Method
        </Button>
      </Stack>

      <Group position={'apart'} style={{ marginTop: 'auto' }}>
        <Group spacing={4}>
          <Text className={styles.priceAmount}>$10</Text>
          <Text className={styles.pricePeriod}>/ mo</Text>
        </Group>

        <Box>
          <Button
            intent={Intent.PRIMARY}
            onClick={handleResumeSubBtnClick}
            className={styles.subscribeButton}
          >
            Resume Subscription
          </Button>
        </Box>
      </Group>
    </Card>
  );
}

export const Subscription = R.compose(withAlertActions)(SubscriptionRoot);
