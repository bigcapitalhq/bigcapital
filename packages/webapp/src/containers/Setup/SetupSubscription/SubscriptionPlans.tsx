import { Group, GroupProps } from '@/components';
import { SubscriptionPlan } from './SubscriptionPlan';
import { useSubscriptionPlans } from './hooks';

interface SubscriptionPlansProps {
  wrapProps?: GroupProps;
  onSubscribe?: (variantId: number) => void;
}

export function SubscriptionPlans({
  wrapProps,
  onSubscribe
}: SubscriptionPlansProps) {
  const subscriptionPlans = useSubscriptionPlans();

  return (
    <Group spacing={14} noWrap align="stretch" {...wrapProps}>
      {subscriptionPlans.map((plan, index) => (
        <SubscriptionPlan
          key={index}
          slug={plan.slug}
          label={plan.name}
          description={plan.description}
          features={plan.features}
          featured={plan.featured}
          monthlyPrice={plan.monthlyPrice}
          monthlyPriceLabel={plan.monthlyPriceLabel}
          annuallyPrice={plan.annuallyPrice}
          annuallyPriceLabel={plan.annuallyPriceLabel}
          monthlyVariantId={plan.monthlyVariantId}
          annuallyVariantId={plan.annuallyVariantId}
          onSubscribe={onSubscribe}
        />
      ))}
    </Group>
  );
}
