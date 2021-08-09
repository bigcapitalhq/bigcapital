import React, { createContext, useContext } from 'react';
import { keyBy } from 'lodash';
import {
  IAdvancedFilterContextProps,
  IFilterConditionContextProps,
  IAdvancedFilterProviderProps,
  IFilterConditionProviderProps,
} from './interfaces';

const AdvancedFilterContext = createContext<IAdvancedFilterContextProps>({});
const FilterConditionContext = createContext<IFilterConditionContextProps>({});

/**
 * Advanced filter dropdown context provider.
 */
function AdvancedFilterDropdownProvider({
  initialCondition,
  fields,
  ...props
}: IAdvancedFilterProviderProps) {
  const fieldsByKey = keyBy(fields, 'key');
  // Provider payload.
  const provider = { initialCondition, fields, fieldsByKey };
  return <AdvancedFilterContext.Provider value={provider} {...props} />;
}

/**
 * Filter condition row context provider.
 */
function FilterConditionProvider({
  conditionIndex,
  ...props
}: IFilterConditionProviderProps) {
  // Provider payload.
  const provider = { conditionIndex };
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
