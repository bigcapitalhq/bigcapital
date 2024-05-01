// @ts-nocheck
import { useMemo } from 'react';
import {
  chain,
  isEmpty,
  lowerCase,
  head,
  last,
  set,
  get,
  assign,
} from 'lodash';
import {
  EntityColumn,
  SheetColumn,
  useImportFileContext,
} from './ImportFileProvider';
import { useImportFileMapBootContext } from './ImportFileMappingBoot';
import { deepdash, transformToForm } from '@/utils';
import { ImportFileMappingFormValues } from './_types';

export const getFieldKey = (key: string, group = '') => {
  return group ? `${group}.${key}` : key;
};

type ImportFileMappingRes = { from: string; to: string; group: string }[];

/**
 * Transformes the mapping form values to request.
 * @param {ImportFileMappingFormValues} value
 * @returns {ImportFileMappingRes[]}
 */
export const transformValueToReq = (
  value: ImportFileMappingFormValues,
): { mapping: ImportFileMappingRes[] } => {
  const mapping = chain(value)
    .thru(deepdash.index)
    .pickBy((_value, key) => !isEmpty(get(value, key)))
    .map((from, key) => ({
      from,
      to: key.includes('.') ? last(key.split('.')) : key,
      group: key.includes('.') ? head(key.split('.')) : '',
    }))
    .value();

  return { mapping };
};

/**
 * Transformes the mapping response to form values.
 * @param {{ from: string; to: string, group: string }[]} value
 * @returns {Record<string, object | string>}
 */
export const transformResToFormValues = (
  value: { from: string; to: string , group: string }[],
): Record<string, object | string> => {
  return value?.reduce((acc, map) => {
    const path = map?.group ? `${map.group}.${map.to}` : map.to;
    set(acc, path, map.from);
    return acc;
  }, {});
};

/**
 * Retrieves the initial values of mapping form. 
 * @param {EntityColumn[]} entityColumns 
 * @param {SheetColumn[]} sheetColumns 
 */
const getInitialDefaultValues = (
  entityColumns: EntityColumn[],
  sheetColumns: SheetColumn[],
) => {
  return entityColumns.reduce((acc, { fields, groupKey }) => {
    fields.forEach(({ key, name }) => {
      const _name = lowerCase(name);
      const _matched = sheetColumns.find(
        (column) => lowerCase(column) === _name,
      );
      const _key = groupKey ? `${groupKey}.${key}` : key;
      const _value = _matched ? _matched : '';

      set(acc, _key, _value);
    });
    return acc;
  }, {});
};

/**
 * Retrieves the initial values of mapping form.
 * @returns {Record<string, any>}
 */
export const useImportFileMappingInitialValues = () => {
  const { importFile } = useImportFileMapBootContext();
  const { entityColumns, sheetColumns } = useImportFileContext();

  const initialResValues = useMemo(
    () => transformResToFormValues(importFile?.map || []),
    [importFile?.map],
  );
  // Retrieves the initial default values.
  const initialDefaultValues = useMemo(
    () => getInitialDefaultValues(entityColumns, sheetColumns),
    [entityColumns, sheetColumns],
  );

  return useMemo<Record<string, any>>(
    () =>
      assign(
        initialDefaultValues,
        transformToForm(initialResValues, initialDefaultValues),
      ),
    [initialDefaultValues, initialResValues],
  );
};
