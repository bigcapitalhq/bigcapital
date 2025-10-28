// @ts-nocheck
import React from 'react';


interface WithSubscriptionPlanProps {
  plan: any;
  onSubscribe?: (variantId: number) => void;
}

interface MappedSubscriptionPlanProps {
  slug: string;
  label: string;
  description: string;
  features: any[];
  featured: boolean;
  monthlyPrice: string;
  monthlyPriceLabel: string;
  annuallyPrice: string;
  annuallyPriceLabel: string;
  monthlyVariantId: number;
  annuallyVariantId: number;
  onSubscribe?: (variantId: number) => void;
}

export const withSubscriptionPlanMapper = <
  P extends MappedSubscriptionPlanProps,
>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return function WithSubscriptionPlanMapper(
    props: WithSubscriptionPlanProps &
      Omit<P, keyof MappedSubscriptionPlanProps>,
  ) {
    const { plan, onSubscribe, ...restProps } = props;

    const mappedProps: MappedSubscriptionPlanProps = {
      slug: plan.slug,
      label: plan.name,
      description: plan.description,
      features: plan.features,
      featured: plan.featured,
      monthlyPrice: plan.monthlyPrice,
      monthlyPriceLabel: plan.monthlyPriceLabel,
      annuallyPrice: plan.annuallyPrice,
      annuallyPriceLabel: plan.annuallyPriceLabel,
      monthlyVariantId: plan.monthlyVariantId,
      annuallyVariantId: plan.annuallyVariantId,
      onSubscribe,
    };
    return <WrappedComponent {...mappedProps} {...(restProps as P)} />;
  };
};
