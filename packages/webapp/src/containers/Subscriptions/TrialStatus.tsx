import { Button, Card, H4, Intent, Text } from '@blueprintjs/core';
import moment from 'moment';
import { useBillingPageBoot } from './BillingPageBoot';
import { useUpgradeToGoCheckout } from './useUpgradeToGoCheckout';
import { Box, Can, Group } from '@/components';

/**
 * Go trial summary with an upgrade CTA.
 */
export function TrialStatus() {
  const { mainSubscription } = useBillingPageBoot();
  const { upgrade, isPending, canUpgrade } = useUpgradeToGoCheckout();

  const trialEndsAt = mainSubscription?.trialEndsAt;

  // Only local, provider-less trials are shown here. Stripe-managed trials are
  // already summarized by the subscription card.
  if (!trialEndsAt || mainSubscription?.stripeStatus) {
    return null;
  }

  const isOnTrial = !!mainSubscription?.onTrial && !!mainSubscription?.active;
  const daysLeft = Math.max(
    0,
    Math.ceil(moment(trialEndsAt).diff(moment(), 'days', true)),
  );
  const dayLabel = daysLeft === 1 ? 'day' : 'days';

  return (
    <Card style={{ marginTop: '1.25rem' }}>
      <Group position="apart" align="center" noWrap>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <H4 style={{ margin: 0 }}>
            {isOnTrial ? 'Go trial' : 'Your Go trial has ended'}
          </H4>
          <Text
            className="bp4-text-muted"
            style={{ marginTop: '0.4rem', lineHeight: 1.6 }}
          >
            {isOnTrial
              ? `You have ${daysLeft} ${dayLabel} left. Your trial ends on ${mainSubscription.trialEndsAtFormatted}. Upgrade to Go to keep using Bigcapital after your trial.`
              : `Your trial ended on ${mainSubscription.trialEndsAtFormatted}. Subscribe to Go to keep making changes. Your data is safe and stays available to view.`}
          </Text>
        </Box>

        <Box style={{ flexShrink: 0 }}>
          <Can I="manage" a="all">
            <Button
              intent={Intent.PRIMARY}
              onClick={upgrade}
              loading={isPending}
              disabled={!canUpgrade}
            >
              {isOnTrial ? 'Upgrade to Go' : 'Subscribe to Go'}
            </Button>
          </Can>
        </Box>
      </Group>
    </Card>
  );
}
