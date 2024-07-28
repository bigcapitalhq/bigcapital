// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import * as R from 'ramda';
import { AppToaster } from '@/components';
import { useGetLemonSqueezyCheckout } from '@/hooks/query';
import { PricingPlan } from '@/components/PricingPlan/PricingPlan';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';
import {
  WithPlansProps,
  withPlans,
} from '@/containers/Subscriptions/withPlans';

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
  monthlyVariantId?: string;
  annuallyVariantId?: string;
  onSubscribe?: (variantId: number) => void;
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
  monthlyVariantId,
  annuallyVariantId,
  onSubscribe,

  // #withPlans
  plansPeriod,
}: SubscriptionPricingCombinedProps) {
  const { mutateAsync: getLemonCheckout, isLoading } =
    useGetLemonSqueezyCheckout();

  const handleClick = () => {
    const variantId =
      SubscriptionPlansPeriod.Monthly === plansPeriod
        ? monthlyVariantId
        : annuallyVariantId;

    onSubscribe && onSubscribe(variantId);

    // getLemonCheckout({ variantId })
    //   .then((res) => {
    //     const checkoutUrl = res.data.data.attributes.url;
    //     window.LemonSqueezy.Url.Open(checkoutUrl);
    //   })
    //   .catch(() => {
    //     AppToaster.show({
    //       message: 'Something went wrong!',
    //       intent: Intent.DANGER,
    //     });
    //   });
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
      <PricingPlan.BuyButton loading={isLoading} onClick={handleClick}>
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
