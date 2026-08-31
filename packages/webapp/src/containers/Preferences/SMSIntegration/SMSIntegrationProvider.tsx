import classNames from 'classnames';
import React from 'react';
import { CLASSES } from '@/constants/classes';
import {
  useSaveSettings,
  useSettings,
  useSettingSMSNotifications,
} from '@/hooks/query';
import type { AllSettings } from '@bigcapital/sdk-ts';

export interface SMSNotification {
  key: string;
  notificationLabel?: string;
  notificationDescription?: string;
  moduleFormatted?: string;
  smsMessage?: string;
  isNotificationEnabled?: boolean;
}

export interface SMSIntegrationContextValue {
  allSettings?: AllSettings;
  notifications: SMSNotification[] | undefined;
  isSMSNotificationsLoading: boolean;
  isSMSNotificationsFetching: boolean;
  saveSettingMutate: ReturnType<typeof useSaveSettings>['mutateAsync'];
}

const SMSIntegrationContext = React.createContext<SMSIntegrationContextValue>(
  {} as SMSIntegrationContextValue,
);

export interface SMSIntegrationProviderProps {
  children?: React.ReactNode;
}

/**
 * SMS Integration provider.
 */
function SMSIntegrationProvider({ children }: SMSIntegrationProviderProps) {
  //Fetches Organization Settings.
  const { data: allSettings, isLoading: isSettingsLoading } = useSettings();
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  const {
    data: notifications,
    isLoading: isSMSNotificationsLoading,
    isFetching: isSMSNotificationsFetching,
  } = useSettingSMSNotifications();

  // Provider state.
  const provider: SMSIntegrationContextValue = {
    allSettings,
    notifications: (notifications as SMSNotification[] | undefined) ?? [],
    isSMSNotificationsLoading: isSMSNotificationsLoading || isSettingsLoading,
    isSMSNotificationsFetching,
    saveSettingMutate,
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
