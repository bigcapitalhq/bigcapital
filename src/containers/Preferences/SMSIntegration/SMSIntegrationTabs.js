import React from 'react';
import intl from 'react-intl-universal';

import { Tabs, Tab } from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import SMSMessagesDataTable from './SMSMessagesDataTable';

import '../../../style/pages/Preferences/SMSIntegration.scss';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function SMSIntegrationTabs({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('sms_integration.label'));
  }, [changePreferencesPageTitle]);

  return (
    <div className={classNames(CLASSES.CARD)}>
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
    </div>
  );
}

export default compose(withDashboardActions)(SMSIntegrationTabs);
