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
import { ImportFileMappingFormValues, ImportFileMappingRes } from './_types';

export const getFieldKey = (key: string, group = '') => {
  return group ? `${group}.${key}` : key;
};

export const getDateFieldKey = (key: string, group: string = '') => {
  return `${getFieldKey(key, group)}.dateFormat`;
};

/**
 * Transformes the mapping form values to request.
 * @param {ImportFileMappingFormValues} value
 * @returns {ImportFileMappingRes[]}
 */
export const transformValueToReq = (
  value: ImportFileMappingFormValues,
): { mapping: ImportFileMappingRes[] } => {
  const mapping = chain(value)
    .pickBy((_value, key) => !isEmpty(_value) && _value?.from)
    .map((_value, key) => ({
      from: _value.from,
      dateFormat: _value.dateFormat,
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
  value: { from: string; to: string; group: string }[],
): Record<string, object | string> => {
  return value?.reduce((acc, map) => {
    const path = map?.group ? `['${map.group}.${map.to}']` : map.to;
    const dateFormatObj = map?.dateFormat
      ? { dateFormat: map?.dateFormat }
      : {};

    set(acc, path, { from: map?.from, ...dateFormatObj });
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
      const path = groupKey ? `['${groupKey}.${key}']` : key;
      const from = _matched ? _matched : '';

      set(acc, path, { from });
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
