import classNames from 'classnames';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { AllSettings } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useSaveSettings, useSettings } from '@/hooks/query';

interface FeaturesFormContextValue {
  allSettings?: AllSettings;
  saveSettingMutate: ReturnType<typeof useSaveSettings>['mutateAsync'];
}

const FeaturesFormContext = React.createContext<FeaturesFormContextValue>(
  {} as FeaturesFormContextValue,
);

interface FeaturesFormProviderProps {
  children: ReactNode;
}

function FeaturesFormProvider({
  children,
  ...props
}: FeaturesFormProviderProps) {
  const { data: allSettings, isLoading: isSettingsLoading } = useSettings();
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  const provider: FeaturesFormContextValue = {
    allSettings,
    saveSettingMutate,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <FeaturesFormCard>
        {isSettingsLoading ? (
          <PreferencesPageLoader />
        ) : (
          <FeaturesFormContext.Provider value={provider} {...props}>
            {children}
          </FeaturesFormContext.Provider>
        )}
      </FeaturesFormCard>
    </div>
  );
}

const useFeaturesFormContext = () => React.useContext(FeaturesFormContext);

export { FeaturesFormProvider, useFeaturesFormContext };

const FeaturesFormCard = styled(Card)`
  padding: 25px;
`;
