import { ButtonProps } from '@blueprintjs/core';
import type { SubscriptionPlansResponse } from '@bigcapital/sdk-ts';
import { PricingPlan } from '@/components/PricingPlan/PricingPlan';

export type SubscriptionPlansPeriod = 'monthly' | 'annually';
export type SubscriptionPlanGroup = SubscriptionPlansResponse['plans'][number];
export type SubscriptionPlanPrice = SubscriptionPlanGroup['prices'][number];
export type SubscriptionPlanFeature = SubscriptionPlanGroup['features'][number];

export interface SubscriptionPricingProps {
  plan: SubscriptionPlanGroup;
  period: SubscriptionPlansPeriod;
  currentPlanSlug?: string;
  onSubscribe?: (planSlug: string) => void;
  subscribeButtonLabel?: string;
  subscribeButtonProps?: Partial<ButtonProps>;
}

/**
 * Maps the selected billing period to a plan price row.
 */
export function getPlanPrice(
  plan: SubscriptionPlanGroup,
  period: SubscriptionPlansPeriod,
): SubscriptionPlanPrice | undefined {
  const interval = period === 'annually' ? 'year' : 'month';
  return (
    plan.prices.find((price) => price.interval === interval) || plan.prices[0]
  );
}

/**
 * Displays a single subscription plan card.
 */
export function SubscriptionPlan({
  plan,
  period,
  currentPlanSlug,
  onSubscribe,
  subscribeButtonLabel,
  subscribeButtonProps,
}: SubscriptionPricingProps) {
  const price = getPlanPrice(plan, period);
  const isCurrentPlan = !!price && price.slug === currentPlanSlug;

  const handleClick = () => {
    if (!price || isCurrentPlan) return;
    onSubscribe?.(price.slug);
  };

  return (
    <PricingPlan featured={plan.featured}>
      {plan.featured && (
        <PricingPlan.Featured>Most Popular</PricingPlan.Featured>
      )}
      <PricingPlan.Header label={plan.name} description={plan.description} />

      <PricingPlan.Price
        price={price?.amountFormatted || '—'}
        subPrice={price?.priceLabel || ''}
      />
      <PricingPlan.BuyButton
        onClick={handleClick}
        disabled={isCurrentPlan || !price}
        {...subscribeButtonProps}
      >
        {isCurrentPlan ? 'Current plan' : subscribeButtonLabel || 'Subscribe'}
      </PricingPlan.BuyButton>

      <PricingPlan.Features>
        {plan.features?.map(
          (feature: SubscriptionPlanFeature, index: number) => (
            <PricingPlan.FeatureLine
              key={`${feature.text}-${index}`}
              hintLabel={feature.hintLabel}
              hintContent={feature.hint}
            >
              {feature.text}
            </PricingPlan.FeatureLine>
          ),
        )}
      </PricingPlan.Features>
    </PricingPlan>
  );
}
