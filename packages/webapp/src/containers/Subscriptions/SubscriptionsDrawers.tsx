import { DRAWERS } from '@/constants/drawers';
import { ChangeSubscriptionPlanDrawer } from '@/containers/Subscriptions/drawers/ChangeSubscriptionPlanDrawer/ChangeSubscriptionPlanDrawer';

export function SubscriptionsDrawers() {
  return (
    <>
      <ChangeSubscriptionPlanDrawer name={DRAWERS.CHANGE_SUBSCARIPTION_PLAN} />
    </>
  );
}
