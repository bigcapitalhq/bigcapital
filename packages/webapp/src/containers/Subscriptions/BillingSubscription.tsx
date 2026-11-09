import { Button, Card, Classes, Intent, Text } from '@blueprintjs/core';
import clsx from 'classnames';
import { includes } from 'lodash';
import { getSubscriptionStatusText } from './_utils';
import { useBillingPageBoot } from './BillingPageBoot';
import styles from './BillingSubscription.module.scss';
import { SubscriptionsDrawers } from './SubscriptionsDrawers';
import type { SubscriptionsListResponse } from '@bigcapital/sdk-ts';
import { AppToaster, Can, Group, Stack } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useCreateStripePortalSession } from '@/hooks/query/subscription';
import { useAlertActions, useDrawerActions } from '@/hooks/state';

type MainSubscription = SubscriptionsListResponse['subscriptions'][number];

/**
 * Current subscription summary and actions.
 */
export function Subscription() {
  const { mainSubscription, billingOverview } = useBillingPageBoot();
  const { openAlert } = useAlertActions();
  const { openDrawer } = useDrawerActions();
  const { mutateAsync: createPortalSession, isPending: isPortalPending } =
    useCreateStripePortalSession();

  if (!mainSubscription) {
    return null;
  }

  const handleCancelSubBtnClick = () => {
    openAlert('cancel-main-subscription');
  };
  const handleResumeSubBtnClick = () => {
    openAlert('resume-main-subscription');
  };
  const handleUpdatePaymentMethod = () => {
    createPortalSession()
      .then(({ url }) => {
        window.location.assign(url);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Unable to open the billing portal. Please try again.',
          intent: Intent.DANGER,
        });
      });
  };
  const handleUpgradeBtnClick = () => {
    openDrawer(DRAWERS.CHANGE_SUBSCARIPTION_PLAN);
  };
  const isActive = mainSubscription.active;
  const isCancelScheduled = mainSubscription.cancelAtPeriodEnd;
  const hasStripeAccount = !!billingOverview?.customer;

  return (
    <Card className={styles.root}>
      <SubscriptionsDrawers />
      <Stack spacing={6}>
        <h1 className={styles.title}>{mainSubscription.planName}</h1>

        <Group
          spacing={0}
          className={clsx(styles.period, {
            [Classes.INTENT_DANGER]: includes(
              ['on_trial', 'inactive', 'past_due'],
              mainSubscription.status,
            ),
            [Classes.INTENT_SUCCESS]: includes(
              ['active', 'canceled'],
              mainSubscription.status,
            ),
          })}
        >
          <Text className={styles.periodStatus}>
            {mainSubscription.statusFormatted}
          </Text>

          <SubscriptionStatusText subscription={mainSubscription} />
        </Group>
      </Stack>

      <Text className={styles.description}>
        Control your business bookkeeping with automated accounting, to run
        intelligent reports for faster decision-making.
      </Text>

      {hasStripeAccount && (
        <Can I="manage" a="all">
          <Stack align="flex-start" spacing={8} className={styles.actions}>
            {isActive && (
              <Button
                minimal
                small
                intent={Intent.PRIMARY}
                onClick={handleUpgradeBtnClick}
              >
                Change plan
              </Button>
            )}

            {isActive && isCancelScheduled && (
              <Button
                minimal
                small
                intent={Intent.PRIMARY}
                onClick={handleResumeSubBtnClick}
              >
                Resume subscription
              </Button>
            )}

            {isActive && !isCancelScheduled && (
              <Button
                minimal
                small
                intent={Intent.PRIMARY}
                onClick={handleCancelSubBtnClick}
              >
                Cancel subscription
              </Button>
            )}

            <Button
              minimal
              small
              intent={Intent.PRIMARY}
              onClick={handleUpdatePaymentMethod}
              loading={isPortalPending}
            >
              Manage billing
            </Button>
          </Stack>
        </Can>
      )}

      <Group position={'apart'} style={{ marginTop: 'auto' }}>
        <Group spacing={4}>
          <Text className={styles.priceAmount}>
            {mainSubscription.planPriceFormatted}
          </Text>

          {mainSubscription.planPeriod && (
            <Text className={styles.pricePeriod}>
              / {mainSubscription.planPeriod === 'month' ? 'month' : 'year'}
            </Text>
          )}
        </Group>
      </Group>
    </Card>
  );
}

function SubscriptionStatusText({
  subscription,
}: {
  subscription: MainSubscription;
}) {
  const text = getSubscriptionStatusText(subscription);

  if (!text) return null;

  return <Text className={styles.periodText}>{text}</Text>;
}
