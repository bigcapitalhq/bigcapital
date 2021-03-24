import React, { createContext } from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useSaveSettings, useSettings } from 'hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const GeneralFormContext = createContext();

/**
 * General form provider.
 */
function GeneralFormProvider({ ...props }) {
  // Fetches Organization Settings.
  const { isLoading: isSettingsLoading } = useSettings();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    isSettingsLoading,
    saveSettingMutate,
  };

  const loading = isSettingsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_GENERAL,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        {loading ? (
          <PreferencesPageLoader />
        ) : (
          <GeneralFormContext.Provider value={provider} {...props} />
        )}
      </div>
    </div>
  );
}

const useGeneralFormContext = () => React.useContext(GeneralFormContext);

export { GeneralFormProvider, useGeneralFormContext };
