import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import { displayColumnsByOptions } from './constants';
import { transfromToSnakeCase } from '@/utils';
import { when } from '@/utils/fp';

export const transformDisplayColumnsType = (form: Record<string, any>) => {
  const columnType = displayColumnsByOptions.find(
    (option) => option.key === form.displayColumnsType,
  );
  const base = { ...form };
  return FF.pipe(
    base,
    when(
      () => Boolean(columnType?.by),
      (obj) => ({ ...obj, displayColumnsBy: (columnType as any)?.by }),
    ),
    FO.match(() => base, FF.identity),
    (obj) => ({ ...obj, displayColumnsType: columnType?.type ?? 'total' }),
  );
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
  return FF.pipe(
    form,
    setNoneZeroTransactions,
    ({ filterByOption, ...rest }: Record<string, any>) => rest,
  );
};

export const transformFilterFormToQuery = (form: Record<string, unknown>) => {
  return FF.pipe(
    form,
    transformDisplayColumnsType,
    transformAccountsFilter,
    transfromToSnakeCase,
  );
};
