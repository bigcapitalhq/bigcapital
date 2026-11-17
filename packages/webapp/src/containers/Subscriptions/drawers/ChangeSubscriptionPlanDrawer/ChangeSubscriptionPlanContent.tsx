import { Callout, Classes } from '@blueprintjs/core';
import { useState } from 'react';
import { SubscriptionPlansPeriodSwitcher } from '../../components/SubscriptionPlansPeriodSwitcher';
import { ChangeSubscriptionPlans } from './ChangeSubscriptionPlans';
import type { SubscriptionPlansPeriod } from '../../component/SubscriptionPlan';
import { Box } from '@/components';

export function ChangeSubscriptionPlanContent() {
  const [period, setPeriod] = useState<SubscriptionPlansPeriod>('monthly');

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

        <SubscriptionPlansPeriodSwitcher period={period} onChange={setPeriod} />
        <ChangeSubscriptionPlans period={period} />
      </Box>
    </Box>
  );
}
