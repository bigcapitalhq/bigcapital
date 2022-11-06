// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { get, keyBy } from 'lodash';
import { useFormikContext } from 'formik';

const AdvancedFilterContext = createContext({});
const FilterConditionContext = createContext({});

/**
 * Advanced filter dropdown context provider.
 */
function AdvancedFilterDropdownProvider({
  initialCondition,
  fields,
  ...props
}) {
  const fieldsByKey = keyBy(fields, 'key');

  // Retrieve field meta by the given field key.
  const getFieldMetaByKey = React.useCallback(
    (key) => get(fieldsByKey, key),
    [fieldsByKey],
  );
  // Provider payload.
  const provider = { initialCondition, fields, fieldsByKey, getFieldMetaByKey };

  return <AdvancedFilterContext.Provider value={provider} {...props} />;
}

/**
 * Filter condition row context provider.
 */
function FilterConditionProvider({ conditionIndex, ...props }) {
  const { setFieldValue, values } = useFormikContext();
  const { getFieldMetaByKey } = useAdvancedFilterContext();

  // Condition value path.
  const conditionPath = `conditions[${conditionIndex}]`;

  // Sets conditions value.
  const setConditionValue = React.useCallback(
    (field, value) => {
      return setFieldValue(`${conditionPath}.${field}`, value);
    },
    [conditionPath, setFieldValue],
  );

  // Retrieve condition field value.
  const getConditionValue = React.useCallback(
    (field) => get(values, `${conditionPath}.${field}`),
    [conditionPath, values],
  );

  // The current condition field meta.
  const fieldMeta = React.useMemo(
    () => getFieldMetaByKey(getConditionValue('fieldKey')),
    [getFieldMetaByKey, getConditionValue],
  );

  // Retrieve the condition field path.
  const getConditionFieldPath = React.useCallback(
    (field) => `${conditionPath}.${field}`,
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

const useFilterCondition = () => useContext(FilterConditionContext);
const useAdvancedFilterContext = () => useContext(AdvancedFilterContext);

export {
  AdvancedFilterDropdownProvider,
  FilterConditionProvider,
  useAdvancedFilterContext,
  useFilterCondition,
};
