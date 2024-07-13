import { Group } from '@/components';
import { SubscriptionPlan } from './SubscriptionPlan';
import { useSubscriptionPlans } from './hooks';

export function SubscriptionPlans() {
  const subscriptionPlans = useSubscriptionPlans();

  return (
    <Group spacing={14} noWrap align="stretch">
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
        />
      ))}
    </Group>
  );
}
