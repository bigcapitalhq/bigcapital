import React from 'react';
import {Tabs, Tab} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import PreferencesSubContent from 'components/Preferences/PreferencesSubContent';
import { FormattedMessage as T} from 'react-intl';

export default function AccountsPreferences() {
  const history = useHistory();
  const onChangeTabs = (currentTabId) => {
    switch(currentTabId) {
      default:
        history.push('/preferences/accounts/general');
        break;
      case 'custom_fields':
        history.push('/preferences/accounts/custom_fields');
        break;
    }
  };
  return (
    <div class="preferences__inside-content preferences__inside-content--accounts">
      <Tabs
        animate={true}
        large={true}
        onChange={onChangeTabs}>
        <Tab id="general" title={<T id={'general'}/>} />
        <Tab id="custom_fields" title={<T id={'custom_fields'}/>} />
      </Tabs>

      <PreferencesSubContent preferenceTab="accounts" />
    </div>
  );
}

