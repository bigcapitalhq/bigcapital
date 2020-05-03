import React, { useCallback } from 'react';
import { Tabs, Tab, Button, Intent } from '@blueprintjs/core';
import PreferencesSubContent from 'components/Preferences/PreferencesSubContent';
import connector from 'connectors/UsersPreferences.connector';

function UsersPreferences({ openDialog }) {
  const onChangeTabs = (currentTabId) => {};

  const onClickNewUser = useCallback(() => {
    openDialog('user-form');
  }, [openDialog]);

  return (
    <div class='preferences__inside-content preferences__inside-content--users-roles'>
      <div class='preferences__tabs'>
        <Tabs animate={true} large={true} onChange={onChangeTabs}>
          <Tab id='users' title='Users' />
          <Tab id='roles' title='Roles' />

          <div class='preferences__tabs-extra-actions'>
            <Button intent={Intent.PRIMARY} onClick={onClickNewUser}>
              Invite User
            </Button>

            <Button intent={Intent.PRIMARY} onClick={onClickNewUser}>
              New Role
            </Button>
          </div>
        </Tabs>
      </div>
      <PreferencesSubContent preferenceTab='users' />
    </div>
  );
}

export default connector(UsersPreferences);
