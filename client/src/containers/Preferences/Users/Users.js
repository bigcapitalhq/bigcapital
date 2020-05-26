import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import PreferencesSubContent from 'components/Preferences/PreferencesSubContent';
import connector from 'connectors/UsersPreferences.connector';

function UsersPreferences({ openDialog }) {
  const onChangeTabs = (currentTabId) => {};

  return (
    <div class='preferences__inside-content preferences__inside-content--users-roles'>
      <div class='preferences__tabs'>
        <Tabs animate={true} onChange={onChangeTabs}>
          <Tab id='users' title='Users' />
          <Tab id='roles' title='Roles' />
        </Tabs>
      </div>
      <PreferencesSubContent preferenceTab='users' />
    </div>
  );
}

export default connector(UsersPreferences);
