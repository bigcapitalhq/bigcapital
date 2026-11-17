import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { TwoFactorSettings } from './TwoFactorSettings';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';

type SecurityPreferencesProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Preferences - Security (two-factor authentication of the signed-in user).
 */
function SecurityPreferences({
  // #withDashboardActions
  changePreferencesPageTitle,
}: SecurityPreferencesProps) {
  useEffect(() => {
    changePreferencesPageTitle(intl.get('security.title'));
  }, [changePreferencesPageTitle]);

  return (
    <div className={classNames(CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT)}>
      <SecurityCard>
        <TwoFactorSettings />
      </SecurityCard>
    </div>
  );
}

const SecurityCard = styled(Card)`
  padding: 20px;
  max-width: 720px;
`;

export const Security = FF.pipe(SecurityPreferences, withDashboardActions);
