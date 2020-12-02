import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import PreferencesSubContent from 'components/Preferences/PreferencesSubContent';
import withUserPreferences from 'containers/Preferences/Users/withUserPreferences';

function UsersPreferences({ openDialog }) {
  const onChangeTabs = (currentTabId) => {};

  return (
    <div className={classNames(
      CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
      CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_USERS,
    )}>
      <div className={classNames(CLASSES.CARD)}>
        <div className={classNames(CLASSES.PREFERENCES_PAGE_TABS)}>
          <Tabs animate={true} onChange={onChangeTabs}>
            <Tab id="users" title="Users" />
            <Tab id="roles" title="Roles" />
          </Tabs>
        </div>
        <PreferencesSubContent preferenceTab="users" />
      </div>
    </div>
  );
}

export default withUserPreferences(UsersPreferences);
