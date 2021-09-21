import { transformToCamelCase, flatObject } from 'utils';

export const transfromFilterFormToQuery = (form) => {
  return flatObject(transformToCamelCase(form));
};