// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useSettings, useSettingSMSNotifications } from '@/hooks/query';

const SMSIntegrationContext = React.createContext();

/**
 * SMS Integration provider.
 */
function SMSIntegrationProvider({ ...props }) {
  //Fetches Organization Settings.
  const { isLoading: isSettingsLoading } = useSettings();

  const {
    data: notifications,
    isLoading: isSMSNotificationsLoading,
    isFetching: isSMSNotificationsFetching,
  } = useSettingSMSNotifications();

  // Provider state.
  const provider = {
    notifications,
    isSMSNotificationsLoading,
    isSMSNotificationsFetching,
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
