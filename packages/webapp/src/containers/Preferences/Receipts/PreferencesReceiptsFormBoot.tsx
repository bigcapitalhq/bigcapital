import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useSettingsReceipts } from '@/hooks/query';

export interface PreferencesReceiptsBootContextValue {
  receiptSettings?: SettingsGroup;
  isSettingsLoading: boolean;
}

const PreferencesReceiptsFormContext =
  React.createContext<PreferencesReceiptsBootContextValue>(
    {} as PreferencesReceiptsBootContextValue,
  );

export interface PreferencesReceiptsBootProps {
  children?: React.ReactNode;
}

function PreferencesReceiptsBoot({ children }: PreferencesReceiptsBootProps) {
  // Fetches organization settings.
  const { data: receiptSettings, isLoading: isSettingsLoading } =
    useSettingsReceipts();

  // Provider state.
  const provider: PreferencesReceiptsBootContextValue = {
    receiptSettings,
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
      <PreferencesReceiptsCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <PreferencesReceiptsFormContext.Provider value={provider}>
            {children}
          </PreferencesReceiptsFormContext.Provider>
        )}
      </PreferencesReceiptsCard>
    </div>
  );
}

const PreferencesReceiptsCard = styled(Card)`
  padding: 25px;

  .bp4-form-group {
    max-width: 600px;
  }
`;

const usePreferencesReceiptsFormContext = () =>
  React.useContext(PreferencesReceiptsFormContext);

export { PreferencesReceiptsBoot, usePreferencesReceiptsFormContext };
