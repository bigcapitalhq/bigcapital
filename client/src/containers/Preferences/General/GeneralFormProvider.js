import React, { createContext } from 'react';
import { LoadingIndicator } from 'components';
import { useSaveSettings, useSettings } from 'hooks/query';

const GeneralFormContext = createContext();

/**
 * General form provider.
 */
function GeneralFormProvider({ ...props }) {
  //Fetches Organization Settings.
  const { isFetching: isSettingsLoading } = useSettings();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    isSettingsLoading,
    saveSettingMutate,
  };

  return (
    <LoadingIndicator loading={isSettingsLoading} spinnerSize={28}>
      <GeneralFormContext.Provider value={provider} {...props} />
    </LoadingIndicator>
  );
}

const useGeneralFormContext = () => React.useContext(GeneralFormContext);

export { GeneralFormProvider, useGeneralFormContext };
