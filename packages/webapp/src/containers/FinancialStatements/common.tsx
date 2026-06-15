import * as R from 'ramda';
import { displayColumnsByOptions } from './constants';
import { transfromToSnakeCase } from '@/utils';
import { flow } from 'fp-ts/function';

export const transformDisplayColumnsType = (form: Record<string, any>) => {
  const columnType = R.find(
    R.propEq('key', form.displayColumnsType),
    displayColumnsByOptions,
  );
  return R.pipe(
    R.mergeRight(form),
    R.when(
      () => R.pathOr(false, ['by'], columnType),
      R.assoc('displayColumnsBy', (columnType as any)?.by),
    ),
    R.assoc('displayColumnsType', R.propOr('total', 'type', columnType)),
  )({});
};

const setNoneZeroTransactions = (form: Record<string, any>) => {
  return {
    ...form,
    noneZero: form.filterByOption === 'without-zero-balance',
    noneTransactions: form.filterByOption === 'with-transactions',
    onlyActive: form.filterByOption === 'with-only-active',
  };
};

export const transformAccountsFilter = (form: Record<string, any>) => {
  return flow(
    setNoneZeroTransactions,
    R.omit(['filterByOption']),
  )(form);
};

export const transformFilterFormToQuery = (form: Record<string, unknown>) => {
  return flow(
    transformDisplayColumnsType,
    transformAccountsFilter,
    transfromToSnakeCase,
  )(form);
};
