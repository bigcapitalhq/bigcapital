import { Tabs, Tab } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { SMSIntegrationForm } from './SMSIntegrationForm';
import { SMSMessagesDataTable } from './SMSMessagesDataTable';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

import '@/style/pages/Preferences/SMSIntegration.scss';

type SMSIntegrationTabsInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * SMS Integration Tabs.
 */
function SMSIntegrationTabsInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}: SMSIntegrationTabsInnerProps) {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('sms_integration.label'));
  }, [changePreferencesPageTitle]);

  return (
    <SMSIntegrationCard>
      <div className={classNames(CLASSES.PREFERENCES_PAGE_TABS)}>
        <Tabs animate={true} defaultSelectedTabId={'sms_messages'}>
          <Tab
            id="overview"
            title={intl.get('sms_integration.label.overview')}
            panel={<SMSIntegrationForm />}
          />
          <Tab
            id="sms_messages"
            title={intl.get('sms_integration.label.sms_messages')}
            panel={<SMSMessagesDataTable />}
          />
        </Tabs>
      </div>
    </SMSIntegrationCard>
  );
}

export const SMSIntegrationTabs = compose(withDashboardActions)(
  SMSIntegrationTabsInner,
);

const SMSIntegrationCard = styled(Card)`
  padding: 0;
`;
