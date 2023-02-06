// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import classNames from 'classnames';
import { Tabs, Tab } from '@blueprintjs/core';

import { CLASSES } from '@/constants/classes';
import SMSMessagesDataTable from './SMSMessagesDataTable';
import { Card } from '@/components';

import '@/style/pages/Preferences/SMSIntegration.scss';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import { compose } from '@/utils';

/**
 * SMS Integration Tabs.
 * @returns {React.JSX}
 */
function SMSIntegrationTabs({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
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

export default compose(withDashboardActions)(SMSIntegrationTabs);

const SMSIntegrationCard = styled(Card)`
  padding: 0;
`;
