// @ts-nocheck
import * as R from 'ramda';
import { Callout, Classes, Intent } from '@blueprintjs/core';
import { AppToaster, Box } from '@/components';
import { SubscriptionPlans } from '@/containers/Setup/SetupSubscription/SubscriptionPlans';
import { SubscriptionPlansPeriodSwitcher } from '@/containers/Setup/SetupSubscription/SubscriptionPlansPeriodSwitcher';
import { useChangeSubscriptionPlan } from '@/hooks/query/subscription';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

function ChangeSubscriptionPlanContent({ closeDrawer }) {
  const { mutateAsync: changeSubscriptionPlan } = useChangeSubscriptionPlan();

  // Handle the subscribe button click.
  const handleSubscribe = (variantId: number) => {
    changeSubscriptionPlan({ variant_id: variantId })
      .then(() => {
        closeDrawer(DRAWERS.CHANGE_SUBSCARIPTION_PLAN);
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The subscription plan has been changed successfully.',
        });
      })
      .catch(() => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };

  return (
    <Box className={Classes.DRAWER_BODY}>
      <Box
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          padding: '50px 20px 80px',
        }}
      >
        <Callout style={{ marginBottom: '2rem' }} icon={null}>
          Simple plans. Simple prices. Only pay for what you really need. All
          plans come with award-winning 24/7 customer support. Prices do not
          include applicable taxes.
        </Callout>

        <SubscriptionPlansPeriodSwitcher />
        <SubscriptionPlans onSubscribe={handleSubscribe} />
      </Box>
    </Box>
  );
}

export default R.compose(withDrawerActions)(ChangeSubscriptionPlanContent);
