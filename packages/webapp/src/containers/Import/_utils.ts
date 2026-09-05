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
import { useMemo } from 'react';
import { useImportFileMapBootContext } from './ImportFileMappingBoot';
import {
  EntityColumn,
  SheetColumn,
  useImportFileContext,
} from './ImportFileProvider';
import type { ImportFileMetaMap, ImportFileMappingFormValues } from './_types';
import type { ImportMappingBody } from '@bigcapital/sdk-ts';
import { deepdash, transformToForm } from '@/utils';

export const getFieldKey = (key: string, group = ''): string => {
  return group ? `${group}.${key}` : key;
};

/**
 * Transforms the mapping form values to request body.
 */
export const transformValueToReq = (
  value: ImportFileMappingFormValues,
): ImportMappingBody => {
  const mapping = chain(value)
    .thru(deepdash.index)
    .pickBy((_value, key) => !isEmpty(get(value, key)))
    .map((from, key) => ({
      from: String(from),
      to: key.includes('.') ? (last(key.split('.')) ?? key) : key,
      group: key.includes('.') ? (head(key.split('.')) ?? '') : '',
    }))
    .value();

  return { mapping };
};

/**
 * Transforms the mapping response to form values.
 */
export const transformResToFormValues = (
  value: ImportFileMetaMap[] = [],
): Record<string, string> => {
  return value.reduce((acc, map) => {
    const path = map?.group ? `${map.group}.${map.to}` : map.to;
    set(acc, path, map.from);
    return acc;
  }, {});
};

/**
 * Computes the initial mapping form values by matching entity field names
 * against sheet column headers (case-insensitive).
 */
const getInitialDefaultValues = (
  entityColumns: EntityColumn[],
  sheetColumns: SheetColumn[],
): Record<string, string> => {
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
 * Retrieves the initial values of the mapping form.
 */
export const useImportFileMappingInitialValues =
  (): ImportFileMappingFormValues => {
    const { importFile } = useImportFileMapBootContext();
    const { entityColumns, sheetColumns } = useImportFileContext();

    const initialResValues = useMemo(
      () => transformResToFormValues(importFile?.map || []),
      [importFile?.map],
    );
    const initialDefaultValues = useMemo(
      () => getInitialDefaultValues(entityColumns, sheetColumns),
      [entityColumns, sheetColumns],
    );

    return useMemo(
      () =>
        assign(
          initialDefaultValues,
          transformToForm(initialResValues, initialDefaultValues),
        ),
      [initialDefaultValues, initialResValues],
    );
  };
