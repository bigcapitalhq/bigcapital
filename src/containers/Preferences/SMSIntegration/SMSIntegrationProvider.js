import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useSettings, useSettingSMSNotifications } from 'hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const SMSIntegrationContext = React.createContext();

/**
 * SMS Integration provider.
 */
function SMSIntegrationProvider({ ...props }) {
  //Fetches Organization Settings.
  const { isLoading: isSettingsLoading } = useSettings();

  const { data: notifications, isLoading: isSMSNotificationsLoading } =
    useSettingSMSNotifications();

  // Provider state.
  const provider = {
    notifications,
    isSMSNotificationsLoading,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_SMS_INTEGRATION,
      )}
    >
      <SMSIntegrationContext.Provider value={provider} {...props} />
    </div>
  );
}

const useSMSIntegrationContext = () => React.useContext(SMSIntegrationContext);

export { SMSIntegrationProvider, useSMSIntegrationContext };
