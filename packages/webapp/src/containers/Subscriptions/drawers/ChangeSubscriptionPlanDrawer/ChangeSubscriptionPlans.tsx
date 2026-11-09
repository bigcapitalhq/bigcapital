import { Intent } from '@blueprintjs/core';
import {
  SubscriptionPlan,
  SubscriptionPricingProps,
} from '../../component/SubscriptionPlan';
import { withSubscriptionPlanMapper } from '../../component/withSubscriptionPlanMapper';
import { withPlans } from '../../withPlans';
import type { ComponentType } from 'react';
import { AppToaster, Group } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { useSubscriptionPlans } from '@/hooks/constants/useSubscriptionPlans';
import { useChangeSubscriptionPlan } from '@/hooks/query/subscription';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';

export function ChangeSubscriptionPlans() {
  const subscriptionPlans = useSubscriptionPlans();

  return (
    <Group spacing={14} noWrap align="stretch">
      {subscriptionPlans.map((plan, index) => (
        <SubscriptionPlanMapped key={index} plan={plan} />
      ))}
    </Group>
  );
}

interface ChangeSubscriptionPlansInnerProps extends SubscriptionPricingProps {
  monthlyVariantId: string;
  annuallyVariantId: string;
  plansPeriod: SubscriptionPlansPeriod;
  openDrawer: WithDrawerActionsProps['openDrawer'];
  closeDrawer: WithDrawerActionsProps['closeDrawer'];
}

const ChangeSubscriptionPlansInner = ({
  openDrawer: _openDrawer,
  closeDrawer,
  monthlyVariantId,
  annuallyVariantId,
  plansPeriod,
  ...props
}: ChangeSubscriptionPlansInnerProps) => {
  const { mutateAsync: changeSubscriptionPlan, isPending } =
    useChangeSubscriptionPlan();

  // Handles the subscribe button click.
  const handleSubscribe = () => {
    const variantId =
      plansPeriod === SubscriptionPlansPeriod.Monthly
        ? monthlyVariantId
        : annuallyVariantId;

    changeSubscriptionPlan({ variant_id: Number(variantId) })
      .then(() => {
        closeDrawer(DRAWERS.CHANGE_SUBSCARIPTION_PLAN);
        AppToaster.show({
          message: 'The subscription plan has been changed.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };
  return (
    <SubscriptionPlan
      {...props}
      onSubscribe={handleSubscribe}
      subscribeButtonProps={{ loading: isPending }}
    />
  );
};

export const SubscriptionPlanMapped = withSubscriptionPlanMapper(
  withDrawerActions(
    withPlans(({ plansPeriod }) => ({ plansPeriod }))(
      ChangeSubscriptionPlansInner,
    ) as unknown as ComponentType<
      Omit<SubscriptionPricingProps, 'features'> & {
        features: unknown[];
        monthlyVariantId: string;
        annuallyVariantId: string;
      }
    >,
  ),
);
