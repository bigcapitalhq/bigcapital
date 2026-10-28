import classNames from 'classnames';
import React, { createContext, useContext } from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { SaveSettingsBody, SettingsGroup } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useSaveSettings, useSettings } from '@/hooks/query';

interface ContactsPreferencesFormContextValue {
  customersSettings?: SettingsGroup;
  vendorsSettings?: SettingsGroup;
  saveSettingMutate: (vars: {
    options: SaveSettingsBody['options'];
  }) => Promise<unknown>;
}

const ContactsPreferencesFormContext =
  createContext<ContactsPreferencesFormContextValue>(
    {} as ContactsPreferencesFormContextValue,
  );

interface ContactsPreferencesFormProviderProps {
  children?: React.ReactNode;
}

/**
 * Contacts number preferences form provider.
 */
function ContactsPreferencesFormProvider({
  ...props
}: ContactsPreferencesFormProviderProps) {
  const { data: settings, isLoading: isSettingsLoading } = useSettings();
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  const provider: ContactsPreferencesFormContextValue = {
    customersSettings: settings?.customers,
    vendorsSettings: settings?.vendors,
    saveSettingMutate,
  };
  const isLoading = isSettingsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <ContactsPreferencesCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <ContactsPreferencesFormContext.Provider
            value={provider}
            {...props}
          />
        )}
      </ContactsPreferencesCard>
    </div>
  );
}

const useContactsPreferencesFormContext = () =>
  useContext(ContactsPreferencesFormContext);

export { ContactsPreferencesFormProvider, useContactsPreferencesFormContext };

const ContactsPreferencesCard = styled(Card)`
  padding: 25px;
`;
