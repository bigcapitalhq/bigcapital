// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

import {
  useCreateCustomField,
  useEditCustomField,
  useCustomField,
} from '@/hooks/query';
import PreferencesPageLoader from '@/containers/Preferences/PreferencesPageLoader';

const CustomFieldsFormContext = React.createContext();

/**
 * Custom Fields Form page provider.
 */
function CustomFieldsFormProvider({ customFieldId, isNewMode, ...props }) {
  // Create and edit custom fields mutations.
  const { mutateAsync: createCustomFieldMutate } = useCreateCustomField();
  const { mutateAsync: editCustomFieldMutate } = useEditCustomField();

  // Retrieve custom field.
  const {
    data: customField,
    isLoading: isCustomFieldLoading,
  } = useCustomField(customFieldId, {
    enabled: !!customFieldId,
  });

  // Provider state.
  const provider = {
    isNewMode,
    customFieldId,
    customField,
    createCustomFieldMutate,
    editCustomFieldMutate,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
      )}
    >
      {isCustomFieldLoading ? (
        <PreferencesPageLoader />
      ) : (
        <CustomFieldsFormContext.Provider value={provider} {...props} />
      )}
    </div>
  );
}

const useCustomFieldsFormContext = () => React.useContext(CustomFieldsFormContext);

export { CustomFieldsFormProvider, useCustomFieldsFormContext };
