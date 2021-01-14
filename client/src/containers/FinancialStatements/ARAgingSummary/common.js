import { mapKeys, snakeCase } from 'lodash';

export const transfromFilterFormToQuery = (form) => {
  return mapKeys(form, (v, k) => snakeCase(k));
};