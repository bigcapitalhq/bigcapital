// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useCustomFields } from '@/hooks/query';

const CustomFieldsListContext = React.createContext();

/**
 * Custom fields list provider.
 */
function CustomFieldsListProvider({ ...props }) {
  // Fetch custom fields list.
  const {
    data: customFields,
    isFetching: isCustomFieldsFetching,
    isLoading: isCustomFieldsLoading,
  } = useCustomFields();

  // Provider state.
  const provider = {
    customFields,
    isCustomFieldsFetching,
    isCustomFieldsLoading,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
      )}
    >
      <CustomFieldsListContext.Provider value={provider} {...props} />
    </div>
  );
}

const useCustomFieldsContext = () => React.useContext(CustomFieldsListContext);

export { CustomFieldsListProvider, useCustomFieldsContext };
