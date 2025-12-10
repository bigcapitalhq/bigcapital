// @ts-nocheck
import * as R from 'ramda';
import { displayColumnsByOptions } from './constants';
import { transfromToSnakeCase, flatten } from '@/utils';

/**
 * Associate display columns by and type properties to query object.
 */
export const transformDisplayColumnsType = (form) => {
  const columnType = R.find(
    R.propEq('key', form.displayColumnsType),
    displayColumnsByOptions,
  );
  return R.pipe(
    R.mergeRight(form),
    R.when(
      () => R.pathOr(false, ['by'], columnType),
      R.assoc('displayColumnsBy', columnType?.by),
    ),
    R.assoc('displayColumnsType', R.propOr('total', 'type', columnType)),
  )({});
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
    transfromToSnakeCase,
    transformAccountsFilter,
    transformDisplayColumnsType,
  )(form);
};
