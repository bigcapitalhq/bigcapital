import { get } from 'lodash';
import { universalSearchBinds } from './DashboardUniversalSearchBinds';

/**
 *
 * @returns
 */
export const getUniversalSearchBinds = () => {
  return universalSearchBinds.map((binder) => binder());
};

/**
 *
 * @param {*} resourceType
 * @param {*} key
 * @returns
 */
export const getUniversalSearchBind = (resourceType, key) => {
  const resourceConfig = getUniversalSearchBinds().find(
    (meta) => meta.resourceType === resourceType,
  );
  return key ? get(resourceConfig, key) : resourceConfig;
};

/**
 * 
 * @returns 
 */
export const getUniversalSearchTypeOptions = () => {
  return getUniversalSearchBinds().map((bind) => ({
    key: bind.resourceType,
    label: bind.optionItemLabel,
  }))
}

/**
 * 
 * @returns 
 */
export const getUniversalSearchItemsActions = () => {
  return getUniversalSearchBinds()
    .filter((bind) => bind.selectItemAction)
    .map((bind) => bind.selectItemAction);
}