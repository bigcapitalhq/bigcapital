import classNames from 'classnames';
import React, { createContext } from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  useCurrentOrganization,
  useUpdateOrganization,
  useDateFormats,
  useOrgBaseCurrencyMutateAbilities,
} from '@/hooks/query';

type UpdateOrganizationMutateAsync = ReturnType<
  typeof useUpdateOrganization
>['mutateAsync'];

export interface GeneralFormContextValue {
  isOrganizationLoading: boolean;
  isDateFormatsLoading: boolean;
  updateOrganization: UpdateOrganizationMutateAsync;
  baseCurrencyMutateAbility: string[];
  organization: ReturnType<typeof useCurrentOrganization>['data'];
  dateFormats: ReturnType<typeof useDateFormats>['data'];
}

const GeneralFormContext = createContext<GeneralFormContextValue | null>(null);

export interface GeneralFormProviderProps {
  children?: React.ReactNode;
}

/**
 * General form provider.
 */
function GeneralFormProvider({ children }: GeneralFormProviderProps) {
  // Fetches current organization information.
  const { isLoading: isOrganizationLoading, data: organization } =
    useCurrentOrganization();

  // Fetch date format options.
  const { data: dateFormats, isLoading: isDateFormatsLoading } =
    useDateFormats();

  const { data: baseCurrencyMutateAbility } =
    useOrgBaseCurrencyMutateAbilities();

  // Mutate organization information.
  const { mutateAsync: updateOrganization } = useUpdateOrganization();

  // Provider state.
  const provider: GeneralFormContextValue = {
    isOrganizationLoading,
    isDateFormatsLoading,
    updateOrganization,
    baseCurrencyMutateAbility: (baseCurrencyMutateAbility ??
      []) as unknown as string[],
    organization,
    dateFormats,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_GENERAL,
      )}
    >
      <GeneralFormCard>
        {isOrganizationLoading || isDateFormatsLoading ? (
          <PreferencesPageLoader />
        ) : (
          <GeneralFormContext.Provider value={provider}>
            {children}
          </GeneralFormContext.Provider>
        )}
      </GeneralFormCard>
    </div>
  );
}

const useGeneralFormContext = () => React.useContext(GeneralFormContext);

export { GeneralFormProvider, useGeneralFormContext };

const GeneralFormCard = styled(Card)`
  padding: 25px;
`;
