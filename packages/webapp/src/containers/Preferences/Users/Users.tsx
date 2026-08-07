import { Tabs, Tab } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import '@/style/pages/Preferences/Users.scss';
import { Card } from '@/components';
import PreferencesSubContent from '@/components/Preferences/PreferencesSubContent';
import { CLASSES } from '@/constants/classes';
import {
  withDialogActions,
  type WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';

function UsersPreferences({ openDialog }: WithDialogActionsProps) {
  const onChangeTabs = (currentTabId: string) => {};

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_USERS,
      )}
    >
      <UsersPereferencesCard>
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
      </UsersPereferencesCard>
    </div>
  );
}

export const Users = withDialogActions(UsersPreferences);

const UsersPereferencesCard = styled(Card)`
  padding: 0;
`;
