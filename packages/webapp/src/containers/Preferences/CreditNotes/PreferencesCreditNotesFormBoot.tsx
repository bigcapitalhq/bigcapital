import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useSettingsCreditNotes } from '@/hooks/query';

export interface PreferencesCreditNotesBootContextValue {
  creditNoteSettings?: SettingsGroup;
  isSettingsLoading: boolean;
}

const PreferencesCreditNotesFormContext =
  React.createContext<PreferencesCreditNotesBootContextValue>(
    {} as PreferencesCreditNotesBootContextValue,
  );

export interface PreferencesCreditNotesBootProps {
  children?: React.ReactNode;
}

function PreferencesCreditNotesBoot({
  children,
}: PreferencesCreditNotesBootProps) {
  // Fetches organization settings.
  const { data: creditNoteSettings, isLoading: isSettingsLoading } =
    useSettingsCreditNotes();

  // Provider state.
  const provider: PreferencesCreditNotesBootContextValue = {
    creditNoteSettings,
    isSettingsLoading,
  };
  // Detarmines whether if any query is loading.
  const isLoading = isSettingsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <PreferencesCreditNotesCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <PreferencesCreditNotesFormContext.Provider value={provider}>
            {children}
          </PreferencesCreditNotesFormContext.Provider>
        )}
      </PreferencesCreditNotesCard>
    </div>
  );
}

const PreferencesCreditNotesCard = styled(Card)`
  padding: 25px;

  .bp4-form-group {
    max-width: 600px;
  }
`;

const usePreferencesCreditNotesFormContext = () =>
  React.useContext(PreferencesCreditNotesFormContext);

export { PreferencesCreditNotesBoot, usePreferencesCreditNotesFormContext };
