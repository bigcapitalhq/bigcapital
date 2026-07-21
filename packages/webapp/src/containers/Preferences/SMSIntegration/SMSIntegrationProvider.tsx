import classNames from 'classnames';
import React from 'react';
import { CLASSES } from '@/constants/classes';
import { useSettings, useSettingSMSNotifications } from '@/hooks/query';

export interface SMSNotification {
  key: string;
  notificationLabel?: string;
  notificationDescription?: string;
  moduleFormatted?: string;
  smsMessage?: string;
  isNotificationEnabled?: boolean;
}

export interface SMSIntegrationContextValue {
  notifications: SMSNotification[] | undefined;
  isSMSNotificationsLoading: boolean;
  isSMSNotificationsFetching: boolean;
}

const SMSIntegrationContext =
  React.createContext<SMSIntegrationContextValue>(
    {} as SMSIntegrationContextValue,
  );

export interface SMSIntegrationProviderProps {
  children?: React.ReactNode;
}

/**
 * SMS Integration provider.
 */
function SMSIntegrationProvider({
  children,
}: SMSIntegrationProviderProps) {
  //Fetches Organization Settings.
  const { isLoading: isSettingsLoading } = useSettings();

  const {
    data: notifications,
    isLoading: isSMSNotificationsLoading,
    isFetching: isSMSNotificationsFetching,
  } = useSettingSMSNotifications();

  // Provider state.
  const provider: SMSIntegrationContextValue = {
    notifications: (notifications as SMSNotification[] | undefined) ?? [],
    isSMSNotificationsLoading: isSMSNotificationsLoading || isSettingsLoading,
    isSMSNotificationsFetching,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_SMS_INTEGRATION,
      )}
    >
      <SMSIntegrationContext.Provider value={provider}>
        {children}
      </SMSIntegrationContext.Provider>
    </div>
  );
}

const useSMSIntegrationContext = () => React.useContext(SMSIntegrationContext);

export { SMSIntegrationProvider, useSMSIntegrationContext };
