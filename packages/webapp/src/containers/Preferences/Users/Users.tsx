// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import styled from 'styled-components';
import { Tabs, Tab } from '@blueprintjs/core';

import '@/style/pages/Preferences/Users.scss';

import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import PreferencesSubContent from '@/components/Preferences/PreferencesSubContent';

import withUserPreferences from '@/containers/Preferences/Users/withUserPreferences';

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
      <UsersPreferencesCard>
        <div className={classNames(CLASSES.PREFERENCES_PAGE_TABS)}>
          <Tabs animate={true} onChange={onChangeTabs}>
            <Tab
              id="users"
              title={intl.get('users')}
              panel={<PreferencesSubContent preferenceTab="users" />}
            />
            <Tab
              id="roles"
              title={intl.get('roles')}
              panel={<PreferencesSubContent preferenceTab="roles" />}
            />
          </Tabs>
        </div>
      </UsersPreferencesCard>
    </div>
  );
}

export default withUserPreferences(UsersPreferences);

const UsersPreferencesCard = styled(Card)`
  padding: 0;
`;
