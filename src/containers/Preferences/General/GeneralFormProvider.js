import React, { createContext } from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import {
  useCurrentOrganization,
  useUpdateOrganization,
  useDateFormats,
  useOrgBaseCurrencyMutateAbilities,
} from 'hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const GeneralFormContext = createContext();

/**
 * General form provider.
 */
function GeneralFormProvider({ ...props }) {
  // Fetches current organization information.
  const { isLoading: isOrganizationLoading, data: organization } =
    useCurrentOrganization();

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
      <div className={classNames(CLASSES.CARD)}>
        {isOrganizationLoading || isDateFormatsLoading ? (
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
