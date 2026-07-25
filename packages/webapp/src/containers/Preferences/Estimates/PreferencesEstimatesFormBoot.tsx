import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useSettingsEstimates } from '@/hooks/query';

export interface PreferencesEstimatesBootContextValue {
  estimatesSettings?: SettingsGroup;
  isSettingsLoading: boolean;
}

const PreferencesEstimatesFormContext =
  React.createContext<PreferencesEstimatesBootContextValue>(
    {} as PreferencesEstimatesBootContextValue,
  );

export interface PreferencesEstimatesBootProps {
  children?: React.ReactNode;
}

function PreferencesEstimatesBoot({ children }: PreferencesEstimatesBootProps) {
  // Fetches organization settings.
  const { data: estimatesSettings, isLoading: isSettingsLoading } =
    useSettingsEstimates();

  // Provider state.
  const provider: PreferencesEstimatesBootContextValue = {
    estimatesSettings,
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
      <PreferencesEstimatesCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <PreferencesEstimatesFormContext.Provider value={provider}>
            {children}
          </PreferencesEstimatesFormContext.Provider>
        )}
      </PreferencesEstimatesCard>
    </div>
  );
}

const usePreferencesEstimatesFormContext = () =>
  React.useContext(PreferencesEstimatesFormContext);

const PreferencesEstimatesCard = styled(Card)`
  padding: 25px;

  .bp4-form-group {
    max-width: 600px;
  }
`;

export { PreferencesEstimatesBoot, usePreferencesEstimatesFormContext };
