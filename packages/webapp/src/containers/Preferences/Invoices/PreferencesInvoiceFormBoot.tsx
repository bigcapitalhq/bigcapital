// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useSettings } from '@/hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const PreferencesInvoiceFormContext = React.createContext();

function PreferencesInvoicesBoot({ ...props }) {
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
        <PreferencesInvoiceFormContext.Provider value={provider} {...props} />
      )}
    </div>
  );
}

const usePreferencesInvoiceFormContext = () =>
  React.useContext(PreferencesInvoiceFormContext);

export { PreferencesInvoicesBoot, usePreferencesInvoiceFormContext };
