import { Intent, Switch, Tag, Text } from '@blueprintjs/core';
import type { SubscriptionPlansPeriod } from '../component/SubscriptionPlan';
import { Group } from '@/components';

interface SubscriptionPlansPeriodSwitcherProps {
  period: SubscriptionPlansPeriod;
  onChange: (period: SubscriptionPlansPeriod) => void;
}

/**
 * Monthly/annual plan period switcher.
 */
export function SubscriptionPlansPeriodSwitcher({
  period,
  onChange,
}: SubscriptionPlansPeriodSwitcherProps) {
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.checked ? 'annually' : 'monthly');
  };

  return (
    <Group position={'center'} spacing={10} style={{ marginBottom: '1.6rem' }}>
      <Text>Pay Monthly</Text>
      <Switch
        large
        checked={period === 'annually'}
        onChange={handleSwitchChange}
      />
      <Text>
        Pay Yearly{' '}
        <Tag minimal intent={Intent.NONE}>
          Save more
        </Tag>
      </Text>
    </Group>
  );
}
