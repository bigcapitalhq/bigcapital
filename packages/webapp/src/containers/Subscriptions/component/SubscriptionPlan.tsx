import { ButtonProps } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import { PricingPlan } from '@/components/PricingPlan/PricingPlan';
import {
  WithPlansProps,
  withPlans,
} from '@/containers/Subscriptions/withPlans';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';

interface SubscriptionPricingFeature {
  text: string;
  hint?: string;
  hintLabel?: string;
  style?: Record<string, string>;
}

export interface SubscriptionPricingProps {
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
  subscribeButtonProps?: Partial<ButtonProps>;
}

interface SubscriptionPricingCombinedProps
  extends SubscriptionPricingProps,
    Pick<WithPlansProps, 'plansPeriod'> {}

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
    // The callback is invoked without a variant id (the same call shape as before).
    onSubscribe && onSubscribe(undefined as unknown as number);
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

export const SubscriptionPlan = FF.pipe(
  SubscriptionPlanRoot,
  withPlans(({ plansPeriod }) => ({ plansPeriod })),
);
