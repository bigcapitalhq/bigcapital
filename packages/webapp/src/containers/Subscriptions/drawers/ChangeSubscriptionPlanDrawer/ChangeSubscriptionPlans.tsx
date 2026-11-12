import { Intent, Spinner } from '@blueprintjs/core';
import { useBillingPageBoot } from '../../BillingPageBoot';
import {
  SubscriptionPlan,
  SubscriptionPlansPeriod,
} from '../../component/SubscriptionPlan';
import { AppToaster, Group } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import {
  useChangeSubscriptionPlan,
  useGetSubscriptionPlans,
} from '@/hooks/query/subscription';
import { useDrawerActions } from '@/hooks/state';

interface ChangeSubscriptionPlansProps {
  period: SubscriptionPlansPeriod;
}

/**
 * Plan switcher shown inside the change subscription plan drawer.
 */
export function ChangeSubscriptionPlans({
  period,
}: ChangeSubscriptionPlansProps) {
  const { closeDrawer } = useDrawerActions();
  const { mainSubscription } = useBillingPageBoot();
  const { data, isLoading } = useGetSubscriptionPlans();
  const { mutateAsync: changeSubscriptionPlan, isPending } =
    useChangeSubscriptionPlan();

  const handleSubscribe = (planSlug: string) => {
    changeSubscriptionPlan({ planSlug })
      .then(() => {
        closeDrawer(DRAWERS.CHANGE_SUBSCARIPTION_PLAN);
        AppToaster.show({
          message: 'The subscription plan has been changed.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong while changing the plan.',
          intent: Intent.DANGER,
        });
      });
  };

  if (isLoading) {
    return <Spinner size={30} />;
  }

  const plans = data?.plans || [];

  return (
    <Group spacing={14} noWrap align="stretch">
      {plans.map((plan) => (
        <SubscriptionPlan
          key={plan.slug}
          plan={plan}
          period={period}
          currentPlanSlug={mainSubscription?.planSlug}
          onSubscribe={handleSubscribe}
          subscribeButtonLabel="Switch plan"
          subscribeButtonProps={{ loading: isPending }}
        />
      ))}
    </Group>
  );
}
