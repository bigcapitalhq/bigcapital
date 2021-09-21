import { transformToCamelCase, flatObject } from 'utils';

export const transformFilterFormToQuery = (form) => {
  return flatObject(transformToCamelCase(form));
};