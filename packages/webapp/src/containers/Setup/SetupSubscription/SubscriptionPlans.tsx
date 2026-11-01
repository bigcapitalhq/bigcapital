import { Intent } from '@blueprintjs/core';
import { useSubscriptionPlans } from './hooks';
import type { ComponentType } from 'react';
import { AppToaster, Group, GroupProps } from '@/components';
import {
  SubscriptionPlan,
  SubscriptionPricingProps,
} from '@/containers/Subscriptions/component/SubscriptionPlan';
import { withSubscriptionPlanMapper } from '@/containers/Subscriptions/component/withSubscriptionPlanMapper';
import { withPlans } from '@/containers/Subscriptions/withPlans';
import { useGetLemonSqueezyCheckout } from '@/hooks/query';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';

interface SubscriptionPlansProps {
  wrapProps?: GroupProps;
  onSubscribe?: (variantId: number) => void;
}

type SubscriptionPlanMappedProps = Omit<
  SubscriptionPricingProps,
  'onSubscribe'
> & {
  plansPeriod: SubscriptionPlansPeriod;
  monthlyVariantId: string;
  annuallyVariantId: string;
};

export function SubscriptionPlans({
  wrapProps,
  onSubscribe,
}: SubscriptionPlansProps) {
  const subscriptionPlans = useSubscriptionPlans();

  return (
    <Group spacing={10} noWrap align="stretch" {...wrapProps}>
      {subscriptionPlans.map((plan, index) => (
        <SubscriptionPlanMapped key={index} plan={plan} />
      ))}
    </Group>
  );
}

const SubscriptionPlanMapped = withSubscriptionPlanMapper(
  withPlans(({ plansPeriod }) => ({ plansPeriod }))(
    ({
      plansPeriod,
      monthlyVariantId,
      annuallyVariantId,
      ...planProps
    }: SubscriptionPlanMappedProps) => {
      const { mutateAsync: getLemonCheckout, isPending } =
        useGetLemonSqueezyCheckout();

      const handleSubscribeBtnClick = () => {
        const variantId =
          SubscriptionPlansPeriod.Monthly === plansPeriod
            ? monthlyVariantId
            : annuallyVariantId;

        getLemonCheckout({ variantId })
          .then((res) => {
            const checkoutUrl = res.data.data.attributes.url;
            window.LemonSqueezy?.Url.Open(checkoutUrl);
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
          {...planProps}
          onSubscribe={handleSubscribeBtnClick}
          subscribeButtonProps={{
            loading: isPending,
          }}
        />
      );
    },
  ) as unknown as ComponentType<
    Omit<SubscriptionPricingProps, 'features'> & {
      features: unknown[];
      monthlyVariantId: string;
      annuallyVariantId: string;
    }
  >,
);
