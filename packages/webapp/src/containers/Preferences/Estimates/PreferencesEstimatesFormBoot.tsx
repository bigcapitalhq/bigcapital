// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useSettings } from '@/hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const PreferencesEstimatesFormContext = React.createContext();

function PreferencesEstimatesBoot({ ...props }) {
  // Fetches organization settings.
  const { isLoading: isSettingsLoading } = useSettings();

  // Provider state.
  const provider = {
    organization: {},
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
      {isLoading ? (
        <PreferencesPageLoader />
      ) : (
        <PreferencesEstimatesFormContext.Provider value={provider} {...props} />
      )}
    </div>
  );
}

const usePreferencesEstimatesFormContext = () =>
  React.useContext(PreferencesEstimatesFormContext);

export { PreferencesEstimatesBoot, usePreferencesEstimatesFormContext };
