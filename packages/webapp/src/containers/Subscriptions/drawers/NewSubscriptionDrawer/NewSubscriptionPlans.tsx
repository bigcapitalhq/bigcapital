// @ts-nocheck
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { AppToaster, Group } from '@/components';
import { SubscriptionPlan } from '../../component/SubscriptionPlan';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';
import { useSubscriptionPlans } from '@/hooks/constants/useSubscriptionPlans';
import { withSubscriptionPlanMapper } from '../../component/withSubscriptionPlanMapper';
import { useGetLemonSqueezyCheckout } from '@/hooks/query';

export function NewSubscriptionPlans() {
  const subscriptionPlans = useSubscriptionPlans();

  return (
    <Group spacing={14} noWrap align="stretch">
      {subscriptionPlans.map((plan, index) => (
        <NewSubscriptionPlanMapped plan={plan} />
      ))}
    </Group>
  );
}

export const NewSubscriptionPlanMapped = R.compose(
  withSubscriptionPlanMapper,
)(
  ({
    monthlyVariantId,
    annuallyVariantId,
    plansPeriod,
    ...props
  }) => {
    const { mutateAsync: getLemonCheckout, isLoading } =
      useGetLemonSqueezyCheckout();

    // Handles the subscribe button click.
    const handleSubscribe = () => {
      const variantId =
        plansPeriod === SubscriptionPlansPeriod.Monthly
          ? monthlyVariantId
          : annuallyVariantId;

      getLemonCheckout({ variantId })
        .then((res) => {
          const checkoutUrl = res.data.data.attributes.url;
          window.LemonSqueezy.Url.Open(checkoutUrl);
        })
        .catch(() => {
          AppToaster.show({
            message: 'Something went wrong!',
            intent: Intent.DANGER,
          });
        });
    };
    return (
      <SubscriptionPlan
        {...props}
        onSubscribe={handleSubscribe}
        subscribeButtonProps={{ loading: isLoading }}
      />
    );
  },
);
