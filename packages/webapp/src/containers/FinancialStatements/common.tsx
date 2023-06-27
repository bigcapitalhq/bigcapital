// @ts-nocheck
import * as R from 'ramda';
import { displayColumnsByOptions } from './constants';
import { transformToSnakeCase, flatten } from '@/utils';

/**
 * Associate display columns by and type properties to query object.
 */
export const transformDisplayColumnsType = (form) => {
  const columnType = displayColumnsByOptions.find(
    (o) => o.key === form.displayColumnsType,
  );
  return {
    ...form,
    displayColumnsBy: columnType ? columnType.by : '',
    displayColumnsType: columnType ? columnType.type : 'total',
  };
};

/**
 * Associate none zero and none transaction property to query.
 */
const setNoneZeroTransactions = (form) => {
  return {
    ...form,
    noneZero: form.filterByOption === 'without-zero-balance',
    noneTransactions: form.filterByOption === 'with-transactions',
    onlyActive: form.filterByOption === 'with-only-active',
  };
};
// filterByOption
export const transformAccountsFilter = (form) => {
  return R.compose(R.omit(['filterByOption']), setNoneZeroTransactions)(form);
};

/**
 * Transform filter form to http query.
 */
export const transformFilterFormToQuery = (form) => {
  return R.compose(
    R.curry(flatten)({ safe: true }),
    transformToSnakeCase,
    transformAccountsFilter,
    transformDisplayColumnsType,
  )(form);
};
