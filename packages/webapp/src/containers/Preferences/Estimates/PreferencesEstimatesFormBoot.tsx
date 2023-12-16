// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useSettings } from '@/hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';
import styled from 'styled-components';
import { Card } from '@/components';

const PreferencesEstimatesFormContext = React.createContext();

function PreferencesEstimatesBoot({ ...props }) {
  // Fetches organization settings.
  const { isLoading: isSettingsLoading } = useSettings();

  // Provider state.
  const provider = {
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
          <PreferencesEstimatesFormContext.Provider
            value={provider}
            {...props}
          />
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
