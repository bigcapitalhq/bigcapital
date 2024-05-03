// @ts-nocheck
import React, { createContext } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  useCurrentOrganization,
  useUpdateOrganization,
  useDateFormats,
  useOrgBaseCurrencyMutateAbilities,
} from '@/hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const GeneralFormContext = createContext();

/**
 * General form provider.
 */
function GeneralFormProvider({ ...props }) {
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
  const provider = {
    isOrganizationLoading,
    isDateFormatsLoading,
    updateOrganization,
    baseCurrencyMutateAbility,
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
          <GeneralFormContext.Provider value={provider} {...props} />
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
