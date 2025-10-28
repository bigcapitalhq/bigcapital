// @ts-nocheck
import * as R from 'ramda';
import { PricingPlan } from '@/components/PricingPlan/PricingPlan';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';
import {
  WithPlansProps,
  withPlans,
} from '@/containers/Subscriptions/withPlans';
import { ButtonProps } from '@blueprintjs/core';

interface SubscriptionPricingFeature {
  text: string;
  hint?: string;
  hintLabel?: string;
  style?: Record<string, string>;
}

interface SubscriptionPricingProps {
  slug: string;
  label: string;
  description: string;
  features?: Array<SubscriptionPricingFeature>;
  featured?: boolean;
  monthlyPrice: string;
  monthlyPriceLabel: string;
  annuallyPrice: string;
  annuallyPriceLabel: string;
  onSubscribe?: (variantId: number) => void;
  subscribeButtonProps?: Optional<ButtonProps>;
}

interface SubscriptionPricingCombinedProps
  extends SubscriptionPricingProps,
    WithPlansProps {}

function SubscriptionPlanRoot({
  label,
  description,
  featured,
  features,
  monthlyPrice,
  monthlyPriceLabel,
  annuallyPrice,
  annuallyPriceLabel,
  onSubscribe,
  subscribeButtonProps,

  // #withPlans
  plansPeriod,
}: SubscriptionPricingCombinedProps) {
  const handleClick = () => {
    onSubscribe && onSubscribe();
  };

  return (
    <PricingPlan featured={featured}>
      {featured && <PricingPlan.Featured>Most Popular</PricingPlan.Featured>}
      <PricingPlan.Header label={label} description={description} />

      {plansPeriod === SubscriptionPlansPeriod.Monthly ? (
        <PricingPlan.Price price={monthlyPrice} subPrice={monthlyPriceLabel} />
      ) : (
        <PricingPlan.Price
          price={annuallyPrice}
          subPrice={annuallyPriceLabel}
        />
      )}
      <PricingPlan.BuyButton onClick={handleClick} {...subscribeButtonProps}>
        Subscribe
      </PricingPlan.BuyButton>

      <PricingPlan.Features>
        {features?.map((feature) => (
          <PricingPlan.FeatureLine
            hintLabel={feature.hintLabel}
            hintContent={feature.hint}
          >
            {feature.text}
          </PricingPlan.FeatureLine>
        ))}
      </PricingPlan.Features>
    </PricingPlan>
  );
}

export const SubscriptionPlan = R.compose(
  withPlans(({ plansPeriod }) => ({ plansPeriod })),
)(SubscriptionPlanRoot);
