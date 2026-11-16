import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { AppearanceModeSetting } from './AppearanceModeSetting';
import { DarkStyleSetting } from './DarkStyleSetting';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';

type AppearancePreferencesProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Preferences - Appearance (saved per browser, not per organization).
 * Each setting is its own section component.
 */
function AppearancePreferences({
  // #withDashboardActions
  changePreferencesPageTitle,
}: AppearancePreferencesProps) {
  useEffect(() => {
    changePreferencesPageTitle(intl.get('appearance.title'));
  }, [changePreferencesPageTitle]);

  return (
    <div className={classNames(CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT)}>
      <AppearanceCard>
        <AppearanceModeSetting />
        <Divider />
        <DarkStyleSetting />
      </AppearanceCard>
    </div>
  );
}

const AppearanceCard = styled(Card)`
  padding: 20px;
  max-width: 720px;

  h3 {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 500;
  }
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: 0;
  border-top: 1px solid var(--color-dashboard-card-border);
`;

export const Appearance = FF.pipe(AppearancePreferences, withDashboardActions);
