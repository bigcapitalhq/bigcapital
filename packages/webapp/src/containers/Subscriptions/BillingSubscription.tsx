import { Button, Card, Classes, Intent, Text } from '@blueprintjs/core';
import clsx from 'classnames';
import { includes } from 'lodash';
import {
  getSubscriptionStatusText,
  openPendingTab,
  redirectPendingTab,
} from './_utils';
import { useBillingPageBoot } from './BillingPageBoot';
import styles from './BillingSubscription.module.scss';
import { useUpgradeToGoCheckout } from './useUpgradeToGoCheckout';
import type { SubscriptionsListResponse } from '@bigcapital/sdk-ts';
import { AppToaster, Can, Group, Stack } from '@/components';
import { useCreateStripePortalSession } from '@/hooks/query/subscription';
import { useAlertActions } from '@/hooks/state';

type MainSubscription = SubscriptionsListResponse['subscriptions'][number];

/**
 * Current subscription summary and actions.
 */
export function Subscription() {
  const { mainSubscription } = useBillingPageBoot();
  const { openAlert } = useAlertActions();
  const { mutateAsync: createPortalSession, isPending: isPortalPending } =
    useCreateStripePortalSession();
  const {
    upgrade: upgradeToGo,
    isPending: isUpgradeToGoPending,
    canUpgrade: canUpgradeToGo,
  } = useUpgradeToGoCheckout();

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
    const billingTab = openPendingTab();

    createPortalSession()
      .then(({ url }) => {
        redirectPendingTab(billingTab, url);
      })
      .catch(() => {
        billingTab?.close();
        AppToaster.show({
          message: 'Unable to open the billing portal. Please try again.',
          intent: Intent.DANGER,
        });
      });
  };
  // Only provider-backed (Stripe) subscriptions can be changed/canceled from
  // this page. A local trial is active but has no Stripe subscription yet.
  const isActive = !!mainSubscription.active && !!mainSubscription.stripeStatus;
  // `cancelAtPeriodEnd` is a DB boolean (0/1) at runtime, so coerce it to avoid
  // rendering the raw value in the JSX below.
  const isCancelScheduled = !!mainSubscription.cancelAtPeriodEnd;
  const hasStripeAccount = !!mainSubscription.stripeStatus;
  const isActiveGo = isActive && !!mainSubscription.planSlug?.startsWith('go');
  const showUpgradeToGo = canUpgradeToGo && !isActiveGo;

  return (
    <Card className={styles.root}>
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

      <Text className={clsx(styles.description, 'bp4-text-muted')}>
        Control your business bookkeeping with automated accounting, to run
        intelligent reports for faster decision-making.
      </Text>

      {(hasStripeAccount || showUpgradeToGo) && (
        <Can I="manage" a="all">
          <Stack align="flex-start" spacing={8} className={styles.actions}>
            {hasStripeAccount && (
              <>
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
              </>
            )}

            {showUpgradeToGo && (
              <Button
                minimal
                small
                intent={Intent.PRIMARY}
                onClick={upgradeToGo}
                loading={isUpgradeToGoPending}
              >
                Upgrade to Go
              </Button>
            )}

            {hasStripeAccount && (
              <Button
                minimal
                small
                intent={Intent.PRIMARY}
                onClick={handleUpdatePaymentMethod}
                loading={isPortalPending}
              >
                Manage billing
              </Button>
            )}
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
