import React from 'react';
import {Tabs, Tab} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import PreferencesSubContent from 'components/Preferences/PreferencesSubContent';

export default function AccountsPreferences() {
  const history = useHistory();
  const onChangeTabs = (currentTabId) => {
    switch(currentTabId) {
      default:
        history.push('/dashboard/preferences/accounts/general');
        break;
      case 'custom_fields':
        history.push('/dashboard/preferences/accounts/custom_fields');
        break;
    }
  };
  return (
    <div class="preferences__inside-content preferences__inside-content--accounts">
      <Tabs
        animate={true}
        large={true}
        onChange={onChangeTabs}>
        <Tab id="general" title="General" />
        <Tab id="custom_fields" title="Custom Fields" />
      </Tabs>

      <PreferencesSubContent preferenceTab="accounts" />
    </div>
  );
}

