// @ts-nocheck
import { AppToaster, Group, T } from '@/components';
import { useGetLemonSqueezyCheckout } from '@/hooks/query';
import { Intent } from '@blueprintjs/core';
import { PricingPlan } from '@/components/PricingPlan/PricingPlan';

interface SubscriptionPricingProps {
  slug: string;
  label: string;
  description: string;
  features?: Array<String>;
  featured?: boolean;
  price: string;
  pricePeriod: string;
}

function SubscriptionPricing({
  featured,
  label,
  description,
  features,
  price,
  pricePeriod,
}: SubscriptionPricingProps) {
  const { mutateAsync: getLemonCheckout, isLoading } =
    useGetLemonSqueezyCheckout();

  const handleClick = () => {
    getLemonCheckout({ variantId: '338516' })
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
    <PricingPlan featured={featured}>
      {featured && <PricingPlan.Featured>Most Popular</PricingPlan.Featured>}

      <PricingPlan.Header label={label} description={description} />
      <PricingPlan.Price price={price} subPrice={pricePeriod} />
      <PricingPlan.BuyButton loading={isLoading} onClick={handleClick}>
        Subscribe
      </PricingPlan.BuyButton>

      <PricingPlan.Features>
        {features?.map((feature) => (
          <PricingPlan.FeatureLine>{feature}</PricingPlan.FeatureLine>
        ))}
      </PricingPlan.Features>
    </PricingPlan>
  );
}

export function SubscriptionPlans({ plans }) {
  return (
    <Group spacing={18} noWrap align='stretch'>
      {plans.map((plan, index) => (
        <SubscriptionPricing
          key={index}
          slug={plan.slug}
          label={plan.name}
          description={plan.description}
          features={plan.features}
          featured={plan.featured}
          price={plan.price}
          pricePeriod={plan.pricePeriod}
        />
      ))}
    </Group>
  );
}
