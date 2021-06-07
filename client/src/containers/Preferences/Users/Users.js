import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { formatMessage } from 'services/intl';
import classNames from 'classnames';

import 'style/pages/Preferences/Users.scss';

import { CLASSES } from 'common/classes';
import PreferencesSubContent from 'components/Preferences/PreferencesSubContent';

import withUserPreferences from 'containers/Preferences/Users/withUserPreferences';

/**
 * Preferences page - Users page.
 */
function UsersPreferences({ openDialog }) {
  const onChangeTabs = (currentTabId) => {};

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_USERS,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        <div className={classNames(CLASSES.PREFERENCES_PAGE_TABS)}>
          <Tabs animate={true} onChange={onChangeTabs}>
            <Tab id="users" title={formatMessage({ id: 'users' })} />
            <Tab id="roles" title={formatMessage({ id: 'roles' })} />
          </Tabs>
        </div>
        <PreferencesSubContent preferenceTab="users" />
      </div>
    </div>
  );
}

export default withUserPreferences(UsersPreferences);
