// @ts-nocheck
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { AppToaster, Group } from '@/components';
import { SubscriptionPlan } from '../../component/SubscriptionPlan';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';
import { useSubscriptionPlans } from '@/hooks/constants/useSubscriptionPlans';
import { useChangeSubscriptionPlan } from '@/hooks/query/subscription';
import { withSubscriptionPlanMapper } from '../../component/withSubscriptionPlanMapper';
import { withPlans } from '../../withPlans';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

export function ChangeSubscriptionPlans() {
  const subscriptionPlans = useSubscriptionPlans();

  return (
    <Group spacing={14} noWrap align="stretch">
      {subscriptionPlans.map((plan, index) => (
        <SubscriptionPlanMapped plan={plan} />
      ))}
    </Group>
  );
}

export const SubscriptionPlanMapped = R.compose(
  withSubscriptionPlanMapper,
  withDrawerActions,
  withPlans(({ plansPeriod }) => ({ plansPeriod })),
)(
  ({
    openDrawer,
    closeDrawer,
    monthlyVariantId,
    annuallyVariantId,
    plansPeriod,
    ...props
  }) => {
    const { mutateAsync: changeSubscriptionPlan, isLoading } =
      useChangeSubscriptionPlan();

    // Handles the subscribe button click.
    const handleSubscribe = () => {
      const variantId =
        plansPeriod === SubscriptionPlansPeriod.Monthly
          ? monthlyVariantId
          : annuallyVariantId;

      changeSubscriptionPlan({ variant_id: variantId })
        .then(() => {
          closeDrawer(DRAWERS.CHANGE_SUBSCARIPTION_PLAN);
          AppToaster.show({
            message: 'The subscription plan has been changed.',
            intent: Intent.SUCCESS,
          });
        })
        .catch((error) => {
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
        subscribeButtonProps={{ loading: isLoading }}
      />
    );
  },
);
