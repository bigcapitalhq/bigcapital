import { ChangeEvent } from 'react';
import * as R from 'ramda';
import { Intent, Switch, Tag, Text } from '@blueprintjs/core';
import { Group } from '@/components';
import withSubscriptionPlansActions, {
  WithSubscriptionPlansActionsProps,
} from '@/containers/Subscriptions/withSubscriptionPlansActions';
import { SubscriptionPlansPeriod } from '@/store/plans/plans.reducer';
import styles from './SetupSubscription.module.scss';

interface SubscriptionPlansPeriodsSwitchCombinedProps
  extends WithSubscriptionPlansActionsProps {}

function SubscriptionPlansPeriodSwitcherRoot({
  // #withSubscriptionPlansActions
  changeSubscriptionPlansPeriod,
}: SubscriptionPlansPeriodsSwitchCombinedProps) {
  // Handles the period switch change.
  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeSubscriptionPlansPeriod(
      event.currentTarget.checked
        ? SubscriptionPlansPeriod.Annually
        : SubscriptionPlansPeriod.Monthly,
    );
  };
  return (
    <Group position={'center'} spacing={10} style={{ marginBottom: '1.6rem' }}>
      <Text>Pay Monthly</Text>
      <Switch
        large
        onChange={handleSwitchChange}
        className={styles.periodSwitch}
      />
      <Text>
        Pay Yearly{' '}
        <Tag minimal intent={Intent.NONE}>
          25% Off All Year
        </Tag>
      </Text>
    </Group>
  );
}

export const SubscriptionPlansPeriodSwitcher = R.compose(
  withSubscriptionPlansActions,
)(SubscriptionPlansPeriodSwitcherRoot);
