import { useFormikContext } from 'formik';
import { get, keyBy } from 'lodash';
import React, { createContext, useContext } from 'react';
import type {
  IAdvancedFilterContextProps,
  IAdvancedFilterProviderProps,
  IFilterConditionContextProps,
  IFilterConditionProviderProps,
  IFilterDropdownFormikValues,
  IFilterRole,
  IResourceField,
} from './interfaces';

const AdvancedFilterContext = createContext<
  IAdvancedFilterContextProps | undefined
>(undefined);
const FilterConditionContext = createContext<
  IFilterConditionContextProps | undefined
>(undefined);

/**
 * Advanced filter dropdown context provider.
 */
function AdvancedFilterDropdownProvider({
  initialCondition,
  fields,
  ...props
}: IAdvancedFilterProviderProps) {
  const fieldsByKey = React.useMemo(() => keyBy(fields, 'key'), [fields]) as {
    [fieldKey: string]: IResourceField;
  };

  // Retrieve field meta by the given field key.
  const getFieldMetaByKey = React.useCallback(
    (key: string) => get(fieldsByKey, key) as IResourceField | undefined,
    [fieldsByKey],
  );

  // Provider payload.
  const provider = {
    initialCondition,
    fields,
    fieldsByKey,
    getFieldMetaByKey,
  };

  return <AdvancedFilterContext.Provider value={provider} {...props} />;
}

/**
 * Filter condition row context provider.
 */
function FilterConditionProvider({
  conditionIndex,
  ...props
}: IFilterConditionProviderProps) {
  const { setFieldValue, values } =
    useFormikContext<IFilterDropdownFormikValues>();
  const { getFieldMetaByKey } = useAdvancedFilterContext();

  // Condition value path.
  const conditionPath = `conditions[${conditionIndex}]`;

  // Sets conditions value.
  const setConditionValue = React.useCallback(
    (field: keyof IFilterRole, value: unknown) => {
      return setFieldValue(`${conditionPath}.${field}`, value);
    },
    [conditionPath, setFieldValue],
  );

  // Retrieve condition field value.
  const getConditionValue = React.useCallback(
    (field: keyof IFilterRole) =>
      get(values, `${conditionPath}.${field}`) as unknown,
    [conditionPath, values],
  );

  // The current condition field meta.
  const fieldMeta = React.useMemo(
    () => getFieldMetaByKey(getConditionValue('fieldKey') as string),
    [getFieldMetaByKey, getConditionValue],
  );

  // Retrieve the condition field path.
  const getConditionFieldPath = React.useCallback(
    (field: keyof IFilterRole) => `${conditionPath}.${field}`,
    [conditionPath],
  );

  // Provider payload.
  const provider = {
    fieldMeta,
    conditionIndex,
    getConditionValue,
    getConditionFieldPath,
    setConditionValue,
  };
  return <FilterConditionContext.Provider value={provider} {...props} />;
}

const useFilterCondition = (): IFilterConditionContextProps => {
  const ctx = useContext(FilterConditionContext);
  if (!ctx) {
    throw new Error(
      'useFilterCondition must be used within FilterConditionProvider',
    );
  }
  return ctx;
};

const useAdvancedFilterContext = (): IAdvancedFilterContextProps => {
  const ctx = useContext(AdvancedFilterContext);
  if (!ctx) {
    throw new Error(
      'useAdvancedFilterContext must be used within AdvancedFilterDropdownProvider',
    );
  }
  return ctx;
};

export {
  AdvancedFilterDropdownProvider,
  FilterConditionProvider,
  useAdvancedFilterContext,
  useFilterCondition,
};
